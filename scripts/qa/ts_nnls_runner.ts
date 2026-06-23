import { solveNNLS } from '../../src/utils/nnls';
import * as fs from 'fs';

try {
  const input = fs.readFileSync(0, 'utf-8');
  if (!input) {
    console.error("No input provided on stdin");
    process.exit(1);
  }
  const data = JSON.parse(input);
  const { A, b, w } = data;
  
  const result = solveNNLS(A, b, w || []);
  console.log(JSON.stringify({ result }));
} catch (err: any) {
  console.error("Error in ts_nnls_runner:", err.message);
  process.exit(1);
}
