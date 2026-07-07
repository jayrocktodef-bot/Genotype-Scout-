import sys
import subprocess

files = ["src/lib/AncientAdmixtureCalculator.ts", "src/services/haplogroupPredictor.ts", "src/utils/ancestry/lightImputation.ts", "src/utils/ancestry/ldPruner.ts", "src/services/snpMatcher.ts"]
code = ""
for file in files:
    try:
        with open(file, "r") as f:
            code += f.read() + "\n"
    except Exception:
        pass

prompt = f"""You are a population genetics and ancient DNA expert. Audit these TypeScript modules: AncientAdmixtureCalculator, haplogroupPredictor, lightImputation, ldPruner, snpMatcher. Look for math/logic errors and provide actionable code fixes.
```typescript
{code}
```
"""

subprocess.run(["python3", "/home/jequan/.gemini/config/plugins/deepseek-integration/skills/deepseek/scripts/query_deepseek.py", prompt])
