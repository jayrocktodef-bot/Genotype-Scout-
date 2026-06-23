import numpy as np
import scipy.optimize
import json
import subprocess
import os

def run_ts_nnls(A, b, w=None):
    data = {"A": A.tolist(), "b": b.tolist(), "w": w.tolist() if w is not None else []}
    process = subprocess.Popen(
        ['npx', 'tsx', 'scripts/qa/ts_nnls_runner.ts'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    stdout, stderr = process.communicate(input=json.dumps(data))
    if process.returncode != 0:
        raise Exception(f"TS run failed: {stderr}\\nStdout: {stdout}")
    
    try:
        res = json.loads(stdout)
        return np.array(res['result'])
    except Exception as e:
        raise Exception(f"Failed to parse TS output: {stdout}\\nError: {e}")

def test_nnls():
    np.random.seed(42)
    max_error = 0.0
    failed_tests = 0
    num_tests = 100
    
    print(f"Running {num_tests} random NNLS validations...")
    
    for i in range(num_tests):
        # Genotype admixture typical sizes: e.g. 50 active SNPs, 16 populations
        # NNLS minimizes ||Ax - b||
        # A is (m x n) where m = SNPs, n = populations
        m, n = 50, 16
        A = np.random.rand(m, n)
        # We need a solution that has some true non-negative admixture
        true_x = np.random.rand(n)
        true_x[true_x < 0.5] = 0.0 # Make some sparse
        b = A @ true_x + np.random.randn(m) * 0.01 # Add some noise
        
        w = np.random.rand(m)
        
        # We need to apply weights for scipy
        A_w = A * w[:, np.newaxis]
        b_w = b * w
        
        # Scipy ground truth
        x_true, rnorm = scipy.optimize.nnls(A_w, b_w)
        
        # TS function
        x_ts = run_ts_nnls(A, b, w)
        
        err = np.linalg.norm(x_true - x_ts)
        max_error = max(max_error, err)
        
        if err > 1e-4:
            failed_tests += 1
            if failed_tests == 1:
                print(f"\\nFirst failure at test {i}:")
                print(f"SciPy  x: {x_true[:5]}...")
                print(f"TS App x: {x_ts[:5]}...")
                print(f"Error: {err}")
    
    print(f"\\nValidation Complete.")
    print(f"Max Error over {num_tests} tests: {max_error}")
    
    if max_error > 1e-4:
        print(f"FAIL: TypeScript NNLS deviates significantly from scipy.optimize.nnls in {failed_tests}/{num_tests} tests.")
        exit(1)
    else:
        print("PASS: TypeScript NNLS matches scipy.optimize.nnls perfectly.")
        exit(0)

if __name__ == "__main__":
    test_nnls()
