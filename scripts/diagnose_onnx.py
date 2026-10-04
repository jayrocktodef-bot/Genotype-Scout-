#!/usr/bin/env python3
"""
scripts/diagnose_onnx.py
Comprehensive diagnostic suite for Phase 0 of the ONNX ancestry classifier audit.
"""

import json
import os
import sys
from pathlib import Path
import numpy as np
import onnx
import onnx.numpy_helper
import onnxruntime as ort
from collections import defaultdict

ROOT_DIR = Path(__file__).resolve().parent.parent
MASTER_PATH = ROOT_DIR / "src" / "data" / "master_aims_normalized.json"
MODEL_PATH = ROOT_DIR / "public" / "models" / "genotype_scout_classifier.onnx"
CLASSES_PATH = ROOT_DIR / "public" / "models" / "genotype_scout_classifier.classes.json"
SAMPLE_TEST_PATH = ROOT_DIR / "public" / "samples" / "Iberian_Portuguese_hu33FC53.txt"
VALIDATION_1000G_PATH = ROOT_DIR / "src" / "data" / "reference" / "validation_samples_1000g.json"

POPS = [
    "European",
    "African",
    "East_Asian",
    "South_Asian",
    "Indigenous_American",
    "Middle_Eastern",
    "Oceanian"
]

POP_TO_CODE = {
    "European": "EUR",
    "African": "AFR",
    "East_Asian": "EAS",
    "South_Asian": "SAS",
    "Indigenous_American": "NAT",
    "Middle_Eastern": "MENA",
    "Oceanian": "OCE"
}

def main():
    print("=" * 70)
    print("🔍 PHASE 0: ONNX ANCESTRY CLASSIFIER DIAGNOSTIC SUITE")
    print("=" * 70)

    # 1. Load model, sidecar, master data, validation data
    with open(CLASSES_PATH) as f:
        sidecar = json.load(f)
    with open(MASTER_PATH) as f:
        master = json.load(f)
    with open(VALIDATION_1000G_PATH) as f:
        val_data = json.load(f)

    feature_rsids = sidecar["features"]
    feature_alts = sidecar["altAlleles"]
    classes = sidecar["classes"]
    n_features = len(feature_rsids)
    print(f"Features: {n_features}, Classes: {classes}")

    # Load Iberian test sample
    user_snps = {}
    if SAMPLE_TEST_PATH.exists():
        with open(SAMPLE_TEST_PATH) as f:
            for line in f:
                if line.startswith("#"):
                    continue
                parts = line.strip().split("\t")
                if len(parts) >= 4:
                    user_snps[parts[0].lower()] = parts[3]

    # Build validation matrix exactly as train_ancestry_classifier.py does
    sample_meta = val_data["metadata"]["samples"]
    sample_genotypes = val_data["sampleGenotypes"]

    samples = []
    y_true = []
    X_val_list = []

    for sname, true_pop in sample_meta.items():
        calls = sample_genotypes.get(sname, {})
        vec = [calls.get(rs, 0.0) for rs in feature_rsids]
        X_val_list.append(vec)
        y_true.append(true_pop)
        samples.append(sname)

    if user_snps:
        iberian_vec = []
        for rs, alt in zip(feature_rsids, feature_alts):
            geno = user_snps.get(rs)
            cnt = sum(1.0 for c in geno if c == alt) if geno and geno != "--" else 0.0
            iberian_vec.append(cnt)
        X_val_list.append(iberian_vec)
        y_true.append("European")
        samples.append("Iberian_hu33FC53")

    X_val = np.array(X_val_list, dtype=np.float32)

    # 1. Run ONNX model inference and compute Confusion Matrix
    print("\n--- 1. Confusion Matrix on 26 Validation Samples ---")
    sess = ort.InferenceSession(str(MODEL_PATH), providers=["CPUExecutionProvider"])
    ort_outs = sess.run(None, {"float_input": X_val})
    y_pred = ort_outs[0].tolist()
    y_prob = ort_outs[1]

    # Confusion matrix
    conf = defaultdict(lambda: defaultdict(int))
    for yt, yp in zip(y_true, y_pred):
        conf[yt][yp] += 1

    print(f"{'True Class':<22} | " + " | ".join(f"{c[:4]:<4}" for c in classes))
    print("-" * 70)
    for c_true in sorted(set(y_true)):
        row = [f"{conf[c_true][c_pred]:<4}" for c_pred in classes]
        print(f"{c_true:<22} | " + " | ".join(row))

    print("\nPer-sample predictions and top probability:")
    for sname, yt, yp, prob in zip(samples, y_true, y_pred, y_prob):
        top_prob = np.max(prob)
        correct = "✓" if yt == yp else "✗"
        print(f"  {sname:<18} True: {yt:<20} Pred: {yp:<20} p={top_prob:.3f} [{correct}]")

    # 2. Dosage-definition audit (Leading Hypothesis)
    print("\n--- 2. Dosage-Definition Audit (Correlation with True vs Other Classes) ---")
    # For each marker in feature_rsids, extract panel frequency vector across the 7 classes
    panel_freqs = {c: [] for c in classes}
    for rs in feature_rsids:
        v = master.get(rs, {})
        freqs = v.get("frequencies", {})
        for c in classes:
            code = POP_TO_CODE.get(c, c)
            if code == "NAT":
                f = freqs.get("Native_American_unadmixed") or freqs.get("NAT") or freqs.get("Native_American") or freqs.get("AMR")
            elif code == "MENA":
                f = freqs.get("MENA") or freqs.get("MID") or freqs.get("NAFR")
            elif code == "OCE":
                f = freqs.get("OCE")
            else:
                f = freqs.get(code)
            panel_freqs[c].append(float(f) if f is not None else 0.5)

    for c in classes:
        panel_freqs[c] = np.array(panel_freqs[c], dtype=np.float32)

    # For each sample, compute Pearson correlation of dosage vector with each class's frequency vector
    print(f"{'Sample':<18} {'True Pop':<20} | " + " ".join(f"{c[:3]:>7}" for c in classes) + " | Best Corr Pop")
    print("-" * 90)

    corr_with_true = []
    for i, (sname, yt) in enumerate(zip(samples, y_true)):
        x = X_val[i]
        # Ignore missing (0.0) features or compute correlation across called
        corrs = {}
        for c in classes:
            f = panel_freqs[c]
            r = np.corrcoef(x, f)[0, 1]
            corrs[c] = r
        corr_with_true.append(corrs[yt])
        best_c = max(corrs.keys(), key=lambda k: corrs[k])
        row_str = " ".join(f"{corrs[c]:>7.3f}" for c in classes)
        print(f"{sname:<18} {yt:<20} | {row_str} | {best_c} (r={corrs[best_c]:.3f})")

    avg_true_corr = np.mean(corr_with_true)
    print(f"\nAverage correlation with True Class frequency vector: {avg_true_corr:.4f}")
    if avg_true_corr < 0:
        print("  -> CONFIRMED: Negative correlation with true class! Dosage counts the opposite allele!")
    else:
        print(f"  -> Correlation with true class is positive ({avg_true_corr:.4f}). Check if other classes correlate higher.")

    # 3. Strand audit
    print("\n--- 3. Strand Audit ---")
    # Check whether the alleles in master_aims_normalized are on forward strand and whether 1000G VCF matches
    palindromic_count = 0
    non_palindromic_count = 0
    for rs, alt in zip(feature_rsids, feature_alts):
        v = master.get(rs, {})
        alleles = v.get("alleles", [])
        if len(alleles) >= 2:
            a1, a2 = alleles[0].upper(), alleles[1].upper()
            if {a1, a2} in [{'A', 'T'}, {'C', 'G'}]:
                palindromic_count += 1
            else:
                non_palindromic_count += 1

    print(f"Out of {n_features} features:")
    print(f"  Non-palindromic: {non_palindromic_count} ({non_palindromic_count / n_features * 100:.1f}%)")
    print(f"  Palindromic:     {palindromic_count} ({palindromic_count / n_features * 100:.1f}%)")

    # 4. Missingness audit
    print("\n--- 4. Missingness Audit (0.0-as-REF bias) ---")
    missing_pcts = []
    print(f"{'Sample':<18} {'True Class':<20} {'Called Features':<16} {'Missing Features':<16} {'Missing %':<10}")
    print("-" * 80)
    for sname, yt, vec in zip(samples, y_true, X_val):
        if sname == "Iberian_hu33FC53":
            called = sum(1 for rs in feature_rsids if user_snps.get(rs) and user_snps[rs] != "--")
        else:
            calls = sample_genotypes.get(sname, {})
            called = sum(1 for rs in feature_rsids if rs in calls)
        missing = n_features - called
        pct = (missing / n_features) * 100
        missing_pcts.append(pct)
        print(f"{sname:<18} {yt:<20} {called:<16} {missing:<16} {pct:<10.1f}%")

    print(f"\nAverage feature missingness across validation samples: {np.mean(missing_pcts):.2f}%")
    print(f"Min missingness: {np.min(missing_pcts):.2f}%, Max missingness: {np.max(missing_pcts):.2f}%")

    # Check 0.0-as-REF effect: What does a vector of all zeros predict?
    zero_vec = np.zeros((1, n_features), dtype=np.float32)
    zero_pred = sess.run(None, {"float_input": zero_vec})
    zero_label = zero_pred[0][0]
    zero_probs = zero_pred[1][0]
    print(f"\nPrediction for vector of all 0.0s (100% missing):")
    print(f"  Predicted Label: {zero_label}")
    print(f"  Probabilities: {dict(zip(classes, [round(float(p), 4) for p in zero_probs]))}")

    # Check average frequency of ALT allele across classes
    print("\nMean ALT allele frequency in training data per class:")
    for c in classes:
        print(f"  {c:<22}: {np.mean(panel_freqs[c]):.4f}")

    # 5. Examine Model Weights (Intercepts and Coefficients)
    print("\n--- 5. Logistic Regression Model Weights Audit ---")
    # Load onnx model initializer weights
    model = onnx.load(str(MODEL_PATH))
    weights = {}
    for init in model.graph.initializer:
        weights[init.name] = onnx.numpy_helper.to_array(init)

    print("Initializers found in ONNX graph:")
    for k, v in weights.items():
        print(f"  {k}: shape {v.shape}, dtype {v.dtype}")

if __name__ == "__main__":
    main()
