import json
import numpy as np
from pathlib import Path
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, train_test_split
from sklearn.metrics import accuracy_score, log_loss, classification_report
import onnx
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

ROOT = Path(__file__).resolve().parent.parent.parent
ML_DIR = ROOT / 'data' / 'ml'
ONNX_DIR = ROOT / 'public' / 'models'

def main():
    print("Loading dataset...")
    d = np.load(ML_DIR / 'dataset.npz')
    X = d['features']
    y = d['labels']
    samples = d['samples']
    
    with open(ML_DIR / 'dataset_manifest.json') as f:
        manifest = json.load(f)
    features_meta = manifest['features']
    
    classes = np.unique(y)
    
    print(f"Dataset: {X.shape[0]} samples, {X.shape[1]} features, {len(classes)} classes")
    for c in classes:
        print(f"  {c}: {np.sum(y == c)}")
        
    X_train, X_test, y_train, y_test, s_train, s_test = train_test_split(
        X, y, samples, test_size=0.3, stratify=y, random_state=42
    )
    
    # Save the split samples
    manifest['train_samples'] = list(s_train)
    manifest['test_samples'] = list(s_test)
    
    print("Training LogisticRegression (C=0.5)...")
    clf = LogisticRegression(C=0.5, solver='lbfgs', max_iter=1000)
    clf.fit(X_train, y_train)
    
    print("Evaluating...")
    y_pred = clf.predict(X_test)
    y_prob = clf.predict_proba(X_test)
    
    acc = accuracy_score(y_test, y_pred)
    ll = log_loss(y_test, y_prob)
    print(f"Test Accuracy: {acc:.4f}")
    print(f"Test Log Loss: {ll:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Check if we meet the bar
    # "At least 90% on the 5 validatable classes, log loss < 0.5"
    # Actually, we can check globally or per class. Let's compute global.
    
    print("Exporting ONNX...")
    initial_type = [('float_input', FloatTensorType([None, X.shape[1]]))]
    options = {id(clf): {'zipmap': False}}
    onnx_model = convert_sklearn(clf, initial_types=initial_type, target_opset=15, options=options)
    
    onnx.save_model(onnx_model, str(ONNX_DIR / 'genotype_scout_classifier.onnx'))
    
    # Build sidecar
    sidecar = {
        "version": "3.0.0",
        "modelType": "LogisticRegression (ONNX)",
        "inputName": "float_input",
        "outputNames": ["output_label", "probabilities"],
        "n_features": X.shape[1],
        "n_classes": len(clf.classes_),
        "classes": list(clf.classes_),
        "features": [f['rsid'] for f in features_meta],
        "featureAlleles": [f['featureAllele'] for f in features_meta],
        "otherAlleles": [f['otherAllele'] for f in features_meta],
        "isPalindromic": [f['isPalindromic'] for f in features_meta],
        "imputeMeans": [f['imputeMean'] for f in features_meta],
        "validationAccuracy": float(acc),
        "validationLogLoss": float(ll)
    }
    
    with open(ONNX_DIR / 'genotype_scout_classifier.classes.json', 'w') as f:
        json.dump(sidecar, f, indent=2)
        
    with open(ML_DIR / 'dataset_manifest.json', 'w') as f:
        json.dump(manifest, f, indent=2)
        
    print("Export complete.")

if __name__ == '__main__':
    main()
