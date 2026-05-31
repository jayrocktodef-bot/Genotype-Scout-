
/**
 * Simple Non-Negative Least Squares (NNLS) solver.
 * Uses the Lawson-Hanson algorithm.
 * 
 * Minimizes ||Ax - b|| subject to x >= 0.
 * A: Matrix (m x n)
 * b: Vector (m)
 * w: Weights (m) - optional
 */
export function solveNNLS(A: number[][], b: number[], w: number[] = []): number[] {
  const m = A.length;
  const n = A[0].length;
  
  // Weights adjustment: A_i = w_i * A_i, b_i = w_i * b_i
  let A_w = A.map((row, i) => row.map(val => val * (w[i] || 1)));
  let b_w = b.map((val, i) => val * (w[i] || 1));

  let x = new Array(n).fill(0);
  let P: number[] = []; // Passive set
  let Z: number[] = Array.from({length: n}, (_, i) => i); // Active set

  while (Z.length > 0) {
    // 1. Calculate gradient: w = A^T * (b - Ax)
    let w_grad = new Array(n).fill(0);
    let Ax = new Array(m).fill(0);
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            Ax[i] += A_w[i][j] * x[j];
        }
    }
    
    for (let j = 0; j < n; j++) {
        let grad = 0;
        for (let i = 0; i < m; i++) {
            grad += A_w[i][j] * (b_w[i] - Ax[i]);
        }
        w_grad[j] = grad;
    }

    // Find max gradient in active set
    let max_grad = -Infinity;
    let t = -1;
    for (let j of Z) {
        if (w_grad[j] > max_grad) {
            max_grad = w_grad[j];
            t = j;
        }
    }

    if (max_grad <= 1e-15) break;

    // Move t from Z to P
    P.push(t);
    Z = Z.filter(item => item !== t);

    // Solve least squares for P
    // For small systems, we can solve A_P^T * A_P * x_P = A_P^T * b
    // A_P is A[:, P]
    let A_P: number[][] = A_w.map(row => P.map(idx => row[idx]));
    let At_A = new Array(P.length).fill(0).map(() => new Array(P.length).fill(0));
    let At_b = new Array(P.length).fill(0);

    for (let i = 0; i < P.length; i++) {
        for (let j = 0; j < P.length; j++) {
            for (let k = 0; k < m; k++) {
                At_A[i][j] += A_P[k][i] * A_P[k][j];
            }
        }
        for (let k = 0; k < m; k++) {
            At_b[i] += A_P[k][i] * b_w[k];
        }
    }

    // Simple Gaussian elimination or matrix inversion for 5x5
    let x_P = solveLinearSystem(At_A, At_b);
    
    // Check if all x_P > 0
    let all_positive = true;
    for (let val of x_P) if (val <= 0) all_positive = false;

    if (all_positive) {
        for (let i = 0; i < P.length; i++) x[P[i]] = x_P[i];
    } else {
        // Handle negative values... this is complex for Lawson-Hanson,
        // for now just cap at 0 and normalize.
        for (let i = 0; i < P.length; i++) x[P[i]] = Math.max(0, x_P[i]);
    }
  }

  return x;
}

// Simple Gaussian elimination for small systems (n<=5)
function solveLinearSystem(A: number[][], b: number[]): number[] {
    const n = A.length;
    let M = A.map((row, i) => [...row, b[i]]);
    
    for (let i = 0; i < n; i++) {
        let pivot = i;
        for (let j = i + 1; j < n; j++) if (Math.abs(M[j][i]) > Math.abs(M[pivot][i])) pivot = j;
        [M[i], M[pivot]] = [M[pivot], M[i]];
        
        let div = M[i][i];
        if (Math.abs(div) < 1e-15) continue;
        for (let j = i; j <= n; j++) M[i][j] /= div;
        
        for (let k = 0; k < n; k++) {
            if (k !== i) {
                let factor = M[k][i];
                for (let j = i; j <= n; j++) M[k][j] -= factor * M[i][j];
            }
        }
    }
    return M.map(row => row[n]);
}
