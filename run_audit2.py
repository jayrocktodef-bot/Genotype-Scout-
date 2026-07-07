import sys
import subprocess

with open("scratch_ancestry_engines.ts", "w") as f:
    pass

import glob
files = ["src/engines/ancestry/fastMatrixEngine.ts", "src/engines/ancestry/humanOriginsEngine.ts", "src/engines/ancestry/grafAncEngine.ts", "src/engines/ancestry/comprehensiveEngine.ts", "src/engines/ancestry/microHapEngine.ts", "src/utils/ancestry/distanceMath.ts"]
code = ""
for file in files:
    try:
        with open(file, "r") as f:
            code += f.read() + "\n"
    except Exception:
        pass

prompt = f"""You are a population genetics expert. Audit these TypeScript ancestry engines for mathematical accuracy. Look for math/logic errors. Provide specific, actionable fixes with code.
```typescript
{code}
```
"""

subprocess.run(["python3", "/home/jequan/.gemini/config/plugins/deepseek-integration/skills/deepseek/scripts/query_deepseek.py", prompt])
