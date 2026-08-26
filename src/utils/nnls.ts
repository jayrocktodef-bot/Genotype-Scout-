/**
 * Rigorous Non-Negative Least Squares (NNLS) solver.
 * Uses the complete Lawson-Hanson algorithm with inner-loop back-substitution.
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
  const A_w = A.map((row, i) => row.map(val => val * (w[i] || 1)));
  const b_w = b.map((val, i) => val * (w[i] || 1));

  let x = new Array(n).fill(0);
  let P: Set<number> = new Set();
  let Z: Set<number> = new Set(Array.from({ length: n }, (_, i) => i));

  const tolerance = 1e-12; // Numerical tolerance

  // Outer loop: add elements to passive set (P)
  while (Z.size > 0) {
    // 1. Calculate gradient: w_grad = A^T * (b - Ax)
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

    // Find max gradient in active set (Z)
    let max_grad = -Infinity;
    let t = -1;
    for (let j of Z) {
      if (w_grad[j] > max_grad) {
        max_grad = w_grad[j];
        t = j;
      }
    }

    // If no positive gradient, we have reached the optimal solution
    if (t === -1 || max_grad <= tolerance) {
      break;
    }

    // Move t from Z to P
    P.add(t);
    Z.delete(t);

    // Inner loop: resolve constraints
    let innerLoopLimit = 1000; // prevent infinite loops in degenerate cases
    while (innerLoopLimit-- > 0) {
      const pArray = Array.from(P);
      
      // Solve least squares for P: A_P^T * A_P * s_P = A_P^T * b
      let At_A = new Array(pArray.length).fill(0).map(() => new Array(pArray.length).fill(0));
      let At_b = new Array(pArray.length).fill(0);

      for (let i = 0; i < pArray.length; i++) {
        const idx_i = pArray[i];
        for (let j = 0; j <= i; j++) {
          const idx_j = pArray[j];
          let sum = 0;
          for (let k = 0; k < m; k++) {
            sum += A_w[k][idx_i] * A_w[k][idx_j];
          }
          At_A[i][j] = sum;
          At_A[j][i] = sum;
        }
        let sum_b = 0;
        for (let k = 0; k < m; k++) {
          sum_b += A_w[k][idx_i] * b_w[k];
        }
        At_b[i] = sum_b;
      }

      // Ridge regularization: add 1e-8 to diagonal to stabilize
      // near-singular matrices from highly correlated populations (e.g., CEU vs GBR)
      for (let i = 0; i < pArray.length; i++) {
        At_A[i][i] += 1e-8;
      }

      let s_P = solveLinearSystem(At_A, At_b);
      
      // Map s_P back to full n-dimensional vector s
      let s = new Array(n).fill(0);
      for (let i = 0; i < pArray.length; i++) {
        s[pArray[i]] = s_P[i];
      }

      // Check if all elements in s corresponding to P are > 0
      let all_positive = true;
      for (let j of P) {
        if (s[j] <= tolerance) {
          all_positive = false;
          break;
        }
      }

      if (all_positive) {
        x = s;
        break; // Exit inner loop
      }

      // Calculate interpolation scalar alpha
      let alpha = 2.0; // Starting with a value > 1
      for (let j of P) {
        if (s[j] <= 0) {
          let alpha_j = x[j] / (x[j] - s[j]);
          if (alpha_j < alpha) {
            alpha = alpha_j;
          }
        }
      }

      // Safeguard
      if (alpha > 1.0) alpha = 1.0;
      if (alpha < 0.0) alpha = 0.0;

      // Update x
      for (let j = 0; j < n; j++) {
        x[j] = x[j] + alpha * (s[j] - x[j]);
      }

      // Move any variables in P that hit 0 back to Z
      for (let j of P) {
        if (Math.abs(x[j]) <= tolerance) {
          x[j] = 0;
          P.delete(j);
          Z.add(j);
        }
      }
    }
  }

  return x;
}

/**
 * Elastic Net Non-Negative Least Squares (NNLS) solver.
 * Minimizes: (1/2) || W (Ax - b) ||_2^2 + lambda1 * sum(x) + (lambda2 / 2) * ||x||_2^2
 * subject to x >= 0.
 */
export function solveElasticNetNNLS(
  A: number[][],
  b: number[],
  w: number[] = [],
  lambda1 = 1e-4,
  lambda2 = 1e-4
): number[] {
  const m = A.length;
  const n = A[0].length;

  const A_w = A.map((row, i) => row.map(val => val * (w[i] || 1)));
  const b_w = b.map((val, i) => val * (w[i] || 1));

  let x = new Array(n).fill(0);
  let P: Set<number> = new Set();
  let Z: Set<number> = new Set(Array.from({ length: n }, (_, i) => i));

  const tolerance = 1e-12;

  while (Z.size > 0) {
    let Ax = new Array(m).fill(0);
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        Ax[i] += A_w[i][j] * x[j];
      }
    }
    
    let w_grad = new Array(n).fill(0);
    for (let j = 0; j < n; j++) {
      let grad = 0;
      for (let i = 0; i < m; i++) {
        grad += A_w[i][j] * (b_w[i] - Ax[i]);
      }
      w_grad[j] = grad - lambda1;
    }

    let max_grad = -Infinity;
    let t = -1;
    for (let j of Z) {
      if (w_grad[j] > max_grad) {
        max_grad = w_grad[j];
        t = j;
      }
    }

    if (t === -1 || max_grad <= tolerance) {
      break;
    }

    P.add(t);
    Z.delete(t);

    let innerLoopLimit = 1000;
    while (innerLoopLimit-- > 0) {
      const pArray = Array.from(P);
      
      let At_A = new Array(pArray.length).fill(0).map(() => new Array(pArray.length).fill(0));
      let At_b = new Array(pArray.length).fill(0);

      for (let i = 0; i < pArray.length; i++) {
        const idx_i = pArray[i];
        for (let j = 0; j <= i; j++) {
          const idx_j = pArray[j];
          let sum = 0;
          for (let k = 0; k < m; k++) {
            sum += A_w[k][idx_i] * A_w[k][idx_j];
          }
          At_A[i][j] = sum;
          At_A[j][i] = sum;
        }
        let sum_b = 0;
        for (let k = 0; k < m; k++) {
          sum_b += A_w[k][idx_i] * b_w[k];
        }
        At_b[i] = sum_b - lambda1;
      }

      // Add L2 Ridge penalty to diagonal for collinearity dampening
      for (let i = 0; i < pArray.length; i++) {
        At_A[i][i] += (lambda2 + 1e-8);
      }

      let s_P = solveLinearSystem(At_A, At_b);
      
      let s = new Array(n).fill(0);
      for (let i = 0; i < pArray.length; i++) {
        s[pArray[i]] = s_P[i];
      }

      let all_positive = true;
      for (let j of P) {
        if (s[j] <= tolerance) {
          all_positive = false;
          break;
        }
      }

      if (all_positive) {
        x = s;
        break;
      }

      let alpha = 2.0;
      for (let j of P) {
        if (s[j] <= 0) {
          let alpha_j = x[j] / (x[j] - s[j]);
          if (alpha_j < alpha) {
            alpha = alpha_j;
          }
        }
      }

      if (alpha > 1.0) alpha = 1.0;
      if (alpha < 0.0) alpha = 0.0;

      for (let j = 0; j < n; j++) {
        x[j] = x[j] + alpha * (s[j] - x[j]);
      }

      for (let j of P) {
        if (Math.abs(x[j]) <= tolerance) {
          x[j] = 0;
          P.delete(j);
          Z.add(j);
        }
      }
    }
  }

  // Soft-thresholding: zero out values below soft threshold
  for (let j = 0; j < n; j++) {
    if (x[j] < 0.0005) x[j] = 0;
  }

  return x;
}

// Gaussian elimination with partial pivoting
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  if (n === 0) return [];
  let M = A.map((row, i) => [...row, b[i]]);
  
  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(M[j][i]) > Math.abs(M[pivot][i])) pivot = j;
    }
    // Swap rows
    [M[i], M[pivot]] = [M[pivot], M[i]];
    
    let div = M[i][i];
    if (Math.abs(div) < 1e-15) {
      for (let j = i; j <= n; j++) M[i][j] = 0;
      continue;
    }
    
    for (let j = i; j <= n; j++) M[i][j] /= div;
    
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        let factor = M[k][i];
        for (let j = i; j <= n; j++) {
          M[k][j] -= factor * M[i][j];
        }
      }
    }
  }
  return M.map(row => row[n] || 0);
}
