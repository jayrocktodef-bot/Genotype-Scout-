import sys
import subprocess

with open("scratch_health_engines.ts", "r") as f:
    code = f.read()

prompt = f"""You are a clinical genomics expert. Audit this TypeScript code for math/logic errors in risk scoring, effect sizes, OR conversions, and phenotype assignments. Provide code fixes.
```typescript
{code}
```
"""

subprocess.run(["python3", "/home/jequan/.gemini/config/plugins/deepseek-integration/skills/deepseek/scripts/query_deepseek.py", prompt])
