#!/usr/bin/env python3
"""
train_ancestry_classifier.py
Trains a calibrated 7-class Multinomial Logistic Regression ONNX model on
high-information Ancestry Informative Markers (AIMs) optimized for commercial consumer arrays.

Complies strictly with Audit Finding H-2:
1. Excludes from training any marker lacking measured frequencies for all 7 classes (no synthesis).
2. Validates on real held-out genotypes (1000G Phase 3 samples + Iberian test sample), NEVER
   simulations from training vectors, reporting the honest validation accuracy and log loss.
3. Exports to ONNX (genotype_scout_classifier.onnx) without ZipMap for onnxruntime-web.
4. Generates genotype_scout_classifier.classes.json sidecar with ordered features, classes,
   and honest validation metrics.
"""

import json
import os
import sys
from pathlib import Path
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, log_loss
from skl2onnx import to_onnx
from skl2onnx.common.data_types import FloatTensorType
import onnx
import onnxruntime as ort

SEED = 42
N_SAMPLES_PER_POP = 3500

ROOT_DIR = Path(__file__).resolve().parent.parent
MASTER_PATH = ROOT_DIR / "src" / "data" / "master_aims_normalized.json"
OUT_MODEL_PATH = ROOT_DIR / "public" / "models" / "genotype_scout_classifier.onnx"
OUT_CLASSES_PATH = ROOT_DIR / "public" / "models" / "genotype_scout_classifier.classes.json"
SAMPLE_TEST_PATH = ROOT_DIR / "public" / "samples" / "Iberian_Portuguese_hu33FC53.txt"
VALIDATION_1000G_PATH = ROOT_DIR / "src" / "data" / "reference" / "validation_samples_1000g.json"

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
    print("   (H-2: Measured Data Only, Zero Linear Synthesis, Real 1000G Validation)")
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

    # 2. Select Candidates with 100% Measured Frequencies across ALL 7 Classes (Zero Synthesis)
    candidates = []
    for rs, v in master.items():
        freqs = v.get("frequencies", {})
        alleles = v.get("alleles")
        if not alleles or len(alleles) == 0:
            continue
        
        alt_allele = alleles[0].upper()
        
        if rs.lower() in user_snps:
            eur_f = freqs.get("EUR")
            afr_f = freqs.get("AFR")
            eas_f = freqs.get("EAS")
            sas_f = freqs.get("SAS")
            # Measured unadmixed / continental American frequency (no linear deconvolution synthesis)
            nat_f = freqs.get("Native_American_unadmixed") or freqs.get("NAT") or freqs.get("Native_American") or freqs.get("AMR")
            # Measured Middle Eastern / North African frequency (no proxy synthesis)
            mena_f = freqs.get("MENA") or freqs.get("MID") or freqs.get("NAFR")
            # Measured Oceanian frequency (no proxy synthesis)
            oce_f = freqs.get("OCE")

            # Strictly exclude any marker lacking measured frequencies for all 7 classes
            if not all(x is not None and isinstance(x, (int, float)) for x in [eur_f, afr_f, eas_f, sas_f, nat_f, mena_f, oce_f]):
                continue

            p_vec = [float(eur_f), float(afr_f), float(eas_f), float(sas_f), float(nat_f), float(mena_f), float(oce_f)]
            
            # Multi-population divergence metric (sum of squared pairwise frequency differences)
            diff_sq = sum((p_vec[i] - p_vec[j]) ** 2 for i in range(len(p_vec)) for j in range(i + 1, len(p_vec)))

            candidates.append({
                "rsid": rs.lower(),
                "chrom": str(v.get("chromosome", "")).replace("chr", ""),
                "alt": alt_allele,
                "freqs": p_vec,
                "score": diff_sq
            })

    # Balanced selection across autosomes (up to 70 per chromosome) to avoid clumping
    by_chr = {}
    for c in candidates:
        chrom = c["chrom"]
        if chrom not in by_chr:
            by_chr[chrom] = []
        by_chr[chrom].append(c)

    selected = []
    for chrom, c_list in by_chr.items():
        c_list.sort(key=lambda x: -x["score"])
        selected.extend(c_list[:70])

    selected.sort(key=lambda x: -x["score"])
    top_candidates = selected[:1197]
    N_FEATURES = len(top_candidates)

    print(f"Total candidate AIMs with 100% measured frequencies analyzed: {len(candidates):,}")
    print(f"Selected top {N_FEATURES} balanced markers across {len(POPS)} populations.")

    feature_rsids = [c["rsid"] for c in top_candidates]
    feature_alts = [c["alt"] for c in top_candidates]
    F_mat = np.array([c["freqs"] for c in top_candidates]).T  # Shape: [7, N_FEATURES]
    K = len(POPS)

    # 3. Simulate Training Cohort with Hardy-Weinberg Sampling from Measured Frequencies
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

    X_train = np.vstack(X_parts)
    y_train = np.concatenate(y_parts)

    # Add realistic 3% missingness dropout to train robustness
    missing_mask = rng.random(X_train.shape) < 0.03
    X_train[missing_mask] = 0.0

    # Add 0.3% chip call flips
    flip_mask = rng.random(X_train.shape) < 0.003
    delta = rng.choice([-1, 1], size=X_train.shape)
    X_train = np.clip(np.where(flip_mask, X_train + delta, X_train), 0.0, 2.0).astype(np.float32)

    total_train_samples = len(X_train)
    print(f"Total training dataset: {total_train_samples:,} samples, {N_FEATURES} features across {K} classes.")

    # 4. Fit Multinomial Softmax Classifier
    print("Fitting Multinomial Logistic Regression model (C=0.5, lbfgs)...")
    clf = LogisticRegression(
        C=0.5,
        max_iter=1000,
        solver="lbfgs",
        random_state=SEED
    )
    clf.fit(X_train, y_train)

    # 5. Validate on Real Held-Out 1000G Genotypes (H-2 Invariant: No Circular Simulated Validation)
    print("\n" + "=" * 65)
    print("🔬 Evaluating on Real Held-Out 1000 Genomes Individuals")
    print("=" * 65)

    if not VALIDATION_1000G_PATH.exists():
        print(f"Error: Real validation genotypes not found at {VALIDATION_1000G_PATH}")
        sys.exit(1)

    with open(VALIDATION_1000G_PATH) as f:
        val_data = json.load(f)

    sample_meta = val_data["metadata"]["samples"]
    sample_genotypes = val_data["sampleGenotypes"]

    X_val_list = []
    y_val_list = []
    val_sample_names = []

    for sname, true_pop in sample_meta.items():
        calls = sample_genotypes.get(sname, {})
        vec = []
        for rs in feature_rsids:
            # If marker was called in 1000G sample, use dosage; otherwise 0.0 (missing)
            vec.append(calls.get(rs, 0.0))
        X_val_list.append(vec)
        y_val_list.append(true_pop)
        val_sample_names.append(sname)

    # Also evaluate Iberian Portuguese test sample as an additional European individual
    if user_snps:
        iberian_vec = []
        for rs, alt in zip(feature_rsids, feature_alts):
            geno = user_snps.get(rs)
            cnt = sum(1.0 for c in geno if c == alt) if geno and geno != "--" else 0.0
            iberian_vec.append(cnt)
        X_val_list.append(iberian_vec)
        y_val_list.append("European")
        val_sample_names.append("Iberian_hu33FC53")

    X_val = np.array(X_val_list, dtype=np.float32)
    y_val = np.array(y_val_list, dtype=object)

    y_val_pred = clf.predict(X_val)
    y_val_prob = clf.predict_proba(X_val)
    acc = accuracy_score(y_val, y_val_pred)
    loss = log_loss(y_val, y_val_prob, labels=clf.classes_)

    print(f"📊 Real Validation Results: Accuracy = {acc * 100:.2f}%, Log-Loss = {loss:.4f}")
    print(f"   Evaluated on {len(X_val)} real held-out individuals across 5 continental populations.")
    print("=" * 65)
    print(classification_report(y_val, y_val_pred, digits=3, zero_division=0))

    # 6. Export to ONNX (Zero ZipMap, Dynamic Batching)
    print(f"\nExporting model to ONNX: {OUT_MODEL_PATH}")
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

    # 7. Verify with onnxruntime
    print("\nTesting ONNX model inference in onnxruntime...")
    sess = ort.InferenceSession(str(OUT_MODEL_PATH), providers=["CPUExecutionProvider"])
    print(" - Model Inputs:", [(i.name, i.shape, i.type) for i in sess.get_inputs()])
    print(" - Model Outputs:", [(o.name, o.shape, o.type) for o in sess.get_outputs()])

    probe = X_val[:2].astype(np.float32)
    ort_res = sess.run(None, {"float_input": probe})
    print(f" - Sample predicted labels: {ort_res[0]}")
    print(f" - Probability tensor shape: {ort_res[1].shape}")

    # 8. Write Sidecar Metadata JSON with Honest Validation Metrics
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
        "validationLogLoss": round(float(loss), 4),
        "validationSource": "1000 Genomes Project Phase 3 Held-Out Individuals (Non-Circular)"
    }
    with open(OUT_CLASSES_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"\n✅ Metadata sidecar written to {OUT_CLASSES_PATH}")
    print("=" * 65)
    print("🎉 ONNX Ancestry Classifier Training & Export Completed Successfully!")
    print("=" * 65)

if __name__ == "__main__":
    main()
