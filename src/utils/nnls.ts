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
  if (m === 0) return [];
  const n = A[0].length;
  if (n === 0) return [];
  
  // Weights adjustment: A_i = w_i * A_i, b_i = w_i * b_i
  const A_w = A.map((row, i) => row.map(val => val * (w[i] || 1)));
  const b_w = b.map((val, i) => val * (w[i] || 1));

  // Precompute normal equations: A_w^T * A_w (n x n) and A_w^T * b_w (n)
  // This avoids re-accumulating over all m rows in every inner loop iteration.
  const AtA_full = Array.from({ length: n }, () => new Float64Array(n));
  const Atb_full = new Float64Array(n);
  for (let k = 0; k < m; k++) {
    const row = A_w[k];
    const bk = b_w[k];
    for (let i = 0; i < n; i++) {
      const ri = row[i];
      if (ri === 0) continue;
      Atb_full[i] += ri * bk;
      for (let j = 0; j <= i; j++) {
        const rj = row[j];
        if (rj !== 0) {
          AtA_full[i][j] += ri * rj;
        }
      }
    }
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      AtA_full[j][i] = AtA_full[i][j];
    }
  }

  let x = new Array(n).fill(0);
  let P: Set<number> = new Set();
  let Z: Set<number> = new Set(Array.from({ length: n }, (_, i) => i));

  const tolerance = 1e-12; // Numerical tolerance

  // Outer loop: add elements to passive set (P)
  // Guarded by maxOuter to prevent infinite cycling in degenerate floating-point systems
  let maxOuter = 3 * n + 50;
  while (Z.size > 0 && maxOuter-- > 0) {
    // 1. Calculate gradient: w_grad = A^T * (b - Ax) = Atb - AtA * x
    let w_grad = new Array(n).fill(0);
    for (let j = 0; j < n; j++) {
      let atax = 0;
      for (let k = 0; k < n; k++) {
        atax += AtA_full[j][k] * x[k];
      }
      w_grad[j] = Atb_full[j] - atax;
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
      // Directly extracted from precomputed normal equations in O(|P|^2)
      let At_A = new Array(pArray.length).fill(0).map(() => new Array(pArray.length).fill(0));
      let At_b = new Array(pArray.length).fill(0);

      for (let i = 0; i < pArray.length; i++) {
        const idx_i = pArray[i];
        for (let j = 0; j <= i; j++) {
          const idx_j = pArray[j];
          At_A[i][j] = AtA_full[idx_i][idx_j];
          At_A[j][i] = AtA_full[idx_i][idx_j];
        }
        At_b[i] = Atb_full[idx_i];
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

  return x.map(val => Number.isFinite(val) && val >= 0 ? val : 0);
}

/**
 * Projects a vector y onto the probability simplex: sum(x) = 1, x >= 0.
 * Algorithm: Wang & Carreira-Perpinan (2013) / Duchi et al. (2008).
 * O(n log n) complexity.
 */
export function projectSimplex(y: ArrayLike<number>, n: number): Float64Array {
  const u = Array.from(y).sort((a, b) => b - a);
  let cum = 0;
  let theta = 0;
  for (let j = 0; j < n; j++) {
    cum += u[j];
    if (u[j] - (cum - 1) / (j + 1) > 0) {
      theta = (cum - 1) / (j + 1);
    }
  }
  const x = new Float64Array(n);
  for (let j = 0; j < n; j++) {
    x[j] = Math.max(y[j] - theta, 0);
  }
  return x;
}

/**
 * Solves convex quadratic program on the unit simplex:
 *   min (1/2) x^T M x - v^T x  subject to  x >= 0, sum(x) = 1
 * where M = A^T A (n x n) and v = A^T b (n).
 * Uses projected gradient descent with power-iteration step sizing.
 * Monotonically converges and cannot cycle.
 */
export function solveProjectedGradientSimplex(
  M: Float64Array | number[][],
  v: Float64Array | number[],
  n: number,
  iters = 300
): Float64Array {
  let x = new Float64Array(n).fill(1 / n);

  // Flatten M if 2D array
  const M_flat = M instanceof Float64Array ? M : new Float64Array(n * n);
  if (!(M instanceof Float64Array)) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        M_flat[i * n + j] = (M as number[][])[i][j];
      }
    }
  }
  const v_arr = v instanceof Float64Array ? v : new Float64Array(v);

  // Power iteration for spectral radius (Lipschitz constant)
  let bk = new Float64Array(n).fill(1 / Math.sqrt(n));
  for (let step = 0; step < 20; step++) {
    const nextBk = new Float64Array(n);
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let k = 0; k < n; k++) s += M_flat[j * n + k] * bk[k];
      nextBk[j] = s;
    }
    let norm = 0;
    for (let j = 0; j < n; j++) norm += nextBk[j] * nextBk[j];
    norm = Math.sqrt(norm);
    if (norm > 1e-12) {
      for (let j = 0; j < n; j++) bk[j] = nextBk[j] / norm;
    }
  }
  let L = 0;
  for (let j = 0; j < n; j++) {
    let s = 0;
    for (let k = 0; k < n; k++) s += M_flat[j * n + k] * bk[k];
    L += bk[j] * s;
  }
  if (L <= 0 || !Number.isFinite(L)) L = 1.0;
  const step = 1.0 / (L * 1.05);

  const g = new Float64Array(n);
  const y = new Float64Array(n);

  for (let it = 0; it < iters; it++) {
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let k = 0; k < n; k++) s += M_flat[j * n + k] * x[k];
      g[j] = s - v_arr[j];
      y[j] = x[j] - step * g[j];
    }
    const newX = projectSimplex(y, n);

    let diff = 0;
    for (let j = 0; j < n; j++) {
      const d = newX[j] - x[j];
      diff += d * d;
      x[j] = newX[j];
    }
    if (diff < 1e-16) break;
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

  return x.map(val => Number.isFinite(val) && val >= 0 ? val : 0);
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
  return M.map(row => Number.isFinite(row[n]) ? row[n] : 0);
}
