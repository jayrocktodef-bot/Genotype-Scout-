#!/usr/bin/env python3
"""
train_ancestry_classifier.py
Trains a calibrated 7-class Multinomial Logistic Regression ONNX model on 1,197
high-information Ancestry Informative Markers (AIMs) optimized for commercial consumer arrays.
Includes deconvolution of Indigenous American frequencies from admixed 1000G AMR data.
Exports to ONNX (genotype_scout_classifier.onnx) without ZipMap for onnxruntime-web.
Generates genotype_scout_classifier.classes.json sidecar with ordered feature rsIDs and classes.
"""

import json
import os
import sys
from pathlib import Path
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, log_loss
from skl2onnx import to_onnx
from skl2onnx.common.data_types import FloatTensorType
import onnx
import onnxruntime as ort

SEED = 42
N_SAMPLES_PER_POP = 3500
N_FEATURES = 1197

ROOT_DIR = Path(__file__).resolve().parent.parent
MASTER_PATH = ROOT_DIR / "src" / "data" / "master_aims_normalized.json"
OUT_MODEL_PATH = ROOT_DIR / "public" / "models" / "genotype_scout_classifier.onnx"
OUT_CLASSES_PATH = ROOT_DIR / "public" / "models" / "genotype_scout_classifier.classes.json"
SAMPLE_TEST_PATH = ROOT_DIR / "public" / "samples" / "Iberian_Portuguese_hu33FC53.txt"

# 7 Broad Continental & Regional Ancestry Reference Classes
POPS = [
    "European",
    "African",
    "East_Asian",
    "South_Asian",
    "Indigenous_American",
    "Middle_Eastern",
    "Oceanian"
]

def main():
    print("=" * 65)
    print("🧠 Training Upgraded Genotype Scout ONNX Ancestry Classifier")
    print("=" * 65)

    # 1. Load Master AIMs Reference Data
    print(f"Loading reference dataset: {MASTER_PATH}")
    with open(MASTER_PATH) as f:
        master = json.load(f)

    # Load commercial chip markers from test sample to guarantee array coverage
    user_snps = {}
    if SAMPLE_TEST_PATH.exists():
        with open(SAMPLE_TEST_PATH) as f:
            for line in f:
                if line.startswith("#"):
                    continue
                parts = line.strip().split("\t")
                if len(parts) >= 4:
                    user_snps[parts[0].lower()] = parts[3]
        print(f"Loaded reference commercial array with {len(user_snps):,} SNPs")

    # 2. Select and Deconvolve 1,197 High-Information AIMs
    candidates = []
    for rs, v in master.items():
        freqs = v.get("frequencies", {})
        alleles = v.get("alleles")
        if not alleles or len(alleles) == 0:
            continue
        
        alt_allele = alleles[0].upper()
        
        # Only select markers present on commercial genotyping chips with core 1000G frequencies
        if rs.lower() in user_snps and all(k in freqs for k in ["EUR", "AFR", "EAS", "SAS", "AMR"]):
            eur_f = float(freqs["EUR"])
            afr_f = float(freqs["AFR"])
            eas_f = float(freqs["EAS"])
            sas_f = float(freqs["SAS"])
            amr_f = float(freqs["AMR"])

            # Deconvolve unadmixed Indigenous American: AMR is ~58% EUR, 10% AFR, 32% NAT
            nat_f = freqs.get("Native_American_unadmixed", freqs.get("NAT"))
            if nat_f is None:
                calc_nat = (amr_f - 0.58 * eur_f - 0.10 * afr_f) / 0.32
                nat_f = max(0.005, min(0.995, calc_nat))
            else:
                nat_f = float(nat_f)

            # Middle Eastern / North African proxy
            mena_f = freqs.get("MENA", freqs.get("MID"))
            if mena_f is None:
                mena_f = 0.65 * eur_f + 0.25 * sas_f + 0.10 * afr_f
            else:
                mena_f = float(mena_f)

            # Oceanian proxy
            oce_f = freqs.get("OCE")
            if oce_f is None:
                oce_f = 0.60 * eas_f + 0.25 * sas_f + 0.15 * afr_f
            else:
                oce_f = float(oce_f)

            p_vec = [eur_f, afr_f, eas_f, sas_f, nat_f, mena_f, oce_f]
            
            # Multi-population divergence metric (sum of squared pairwise frequency differences)
            diff_sq = sum((p_vec[i] - p_vec[j]) ** 2 for i in range(len(p_vec)) for j in range(i + 1, len(p_vec)))

            candidates.append({
                "rsid": rs.lower(),
                "alt": alt_allele,
                "freqs": p_vec,
                "score": diff_sq
            })

    candidates.sort(key=lambda x: -x["score"])
    top_candidates = candidates[:N_FEATURES]
    print(f"Total chip-compatible candidate AIMs analyzed: {len(candidates):,}")
    print(f"Selected top {N_FEATURES} markers across {len(POPS)} populations.")

    feature_rsids = [c["rsid"] for c in top_candidates]
    feature_alts = [c["alt"] for c in top_candidates]
    F_mat = np.array([c["freqs"] for c in top_candidates]).T  # Shape: [7, N_FEATURES]
    K = len(POPS)

    # 3. Simulate Cohorts with Hardy-Weinberg Equilibrium & Missingness
    print("\nSynthesizing training cohort with Hardy-Weinberg sampling and chip dropout...")
    rng = np.random.default_rng(SEED)
    X_parts, y_parts = [], []

    for k in range(K):
        p = F_mat[k]
        q = 1.0 - p
        u = rng.random((N_SAMPLES_PER_POP, N_FEATURES))
        dos = np.zeros((N_SAMPLES_PER_POP, N_FEATURES), dtype=np.float32)
        dos += (u > q * q).astype(np.float32)                   # >= 1 ALT allele
        dos += (u > (q * q + 2 * p * q)).astype(np.float32)     # == 2 ALT alleles
        X_parts.append(dos)
        y_parts.append(np.array([POPS[k]] * N_SAMPLES_PER_POP, dtype=object))

    X_all = np.vstack(X_parts)
    y_all = np.concatenate(y_parts)

    # Add realistic 3% missingness dropout to train robustness
    missing_mask = rng.random(X_all.shape) < 0.03
    X_all[missing_mask] = 0.0

    # Add 0.3% chip call flips
    flip_mask = rng.random(X_all.shape) < 0.003
    delta = rng.choice([-1, 1], size=X_all.shape)
    X_all = np.clip(np.where(flip_mask, X_all + delta, X_all), 0.0, 2.0).astype(np.float32)

    total_samples = len(X_all)
    print(f"Total training dataset: {total_samples:,} samples, {N_FEATURES} features across {K} classes.")

    # 4. Train Multinomial Softmax Classifier
    X_train, X_test, y_train, y_test = train_test_split(
        X_all, y_all, test_size=0.15, random_state=SEED, stratify=y_all
    )

    print("Fitting Multinomial Logistic Regression model (C=0.5, lbfgs)...")
    clf = LogisticRegression(
        C=0.5,
        max_iter=1000,
        solver="lbfgs",
        random_state=SEED
    )
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    y_prob = clf.predict_proba(X_test)
    acc = accuracy_score(y_test, y_pred)
    loss = log_loss(y_test, y_prob, labels=clf.classes_)

    print("\n" + "=" * 65)
    print(f"📊 Validation Results: Accuracy = {acc * 100:.2f}%, Log-Loss = {loss:.4f}")
    print("=" * 65)
    print(classification_report(y_test, y_pred, digits=3))

    # 5. Export to ONNX (Zero ZipMap, Dynamic Batching)
    print(f"Exporting model to ONNX: {OUT_MODEL_PATH}")
    initial_type = [("float_input", FloatTensorType([None, N_FEATURES]))]
    onx = to_onnx(
        clf,
        initial_types=initial_type,
        options={"zipmap": False, "output_class_labels": True},
        target_opset=15
    )

    # Standardize output naming: rename 'label' to 'output_label'
    for node in onx.graph.node:
        for i, out_name in enumerate(node.output):
            if out_name == "label":
                node.output[i] = "output_label"
    for out in onx.graph.output:
        if out.name == "label":
            out.name = "output_label"

    # Enforce dynamic batch dimension 'N'
    for inp in onx.graph.input:
        d = inp.type.tensor_type.shape.dim
        d[0].dim_param = "N"
        d[0].ClearField("dim_value")

    onnx.checker.check_model(onx)
    model_bytes = onx.SerializeToString()
    OUT_MODEL_PATH.write_bytes(model_bytes)
    print(f"✅ ONNX model saved successfully ({len(model_bytes) / 1024:.2f} KB)")

    # 6. Verify with onnxruntime
    print("\nTesting ONNX model inference in onnxruntime...")
    sess = ort.InferenceSession(str(OUT_MODEL_PATH), providers=["CPUExecutionProvider"])
    print(" - Model Inputs:", [(i.name, i.shape, i.type) for i in sess.get_inputs()])
    print(" - Model Outputs:", [(o.name, o.shape, o.type) for o in sess.get_outputs()])

    probe = X_test[:2].astype(np.float32)
    ort_res = sess.run(None, {"float_input": probe})
    print(f" - Sample predicted labels: {ort_res[0]}")
    print(f" - Probability tensor shape: {ort_res[1].shape}")

    # 7. Evaluate on Real Test Sample (Iberian Portuguese)
    if user_snps:
        print("\nEvaluating ONNX model on real test genome (Iberian Portuguese):")
        user_vec = []
        for rs, alt in zip(feature_rsids, feature_alts):
            geno = user_snps.get(rs)
            cnt = sum(1.0 for c in geno if c == alt) if geno and geno != "--" else 0.0
            user_vec.append(cnt)
        user_arr = np.array([user_vec], dtype=np.float32)

        res = sess.run(None, {"float_input": user_arr})
        predicted_pop = res[0][0]
        prob_vec = res[1][0]
        class_names = [str(c) for c in clf.classes_]

        print(f" 👉 Predicted Continental Class: {predicted_pop}")
        print(" 👉 Detailed Probability Distribution:")
        for pop, p_val in sorted(zip(class_names, prob_vec), key=lambda x: -x[1]):
            print(f"    {pop:<25}: {p_val * 100:6.2f}%")

    # 8. Write Sidecar Metadata JSON
    classes_list = [str(c) for c in clf.classes_]
    metadata = {
        "version": "2.0.0",
        "modelType": "Multinomial Logistic Regression Softmax",
        "inputName": "float_input",
        "outputNames": ["output_label", "probabilities", "class_labels"],
        "n_features": N_FEATURES,
        "n_classes": len(classes_list),
        "classes": classes_list,
        "features": feature_rsids,
        "altAlleles": feature_alts,
        "validationAccuracy": round(float(acc) * 100, 2),
        "validationLogLoss": round(float(loss), 4)
    }
    with open(OUT_CLASSES_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"\n✅ Metadata sidecar written to {OUT_CLASSES_PATH}")
    print("=" * 65)
    print("🎉 ONNX Ancestry Classifier Training & Export Completed Successfully!")
    print("=" * 65)

if __name__ == "__main__":
    main()
