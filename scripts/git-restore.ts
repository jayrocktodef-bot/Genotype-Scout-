import { execSync } from 'child_process';

try {
  console.log('--- Git Status ---');
  const status = execSync('git status', { encoding: 'utf-8' });
  console.log(status);
  
  console.log('--- Git Diff Summary ---');
  const diff = execSync('git diff --stat', { encoding: 'utf-8' });
  console.log(diff);
} catch (err: any) {
  console.error(`Git error: ${err.message}`);
}
