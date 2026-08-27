#!/usr/bin/env python3
import sys
from pathlib import Path

# Ensure local package importable
sys.path.insert(0, str(Path(__file__).parent))

from ega_latin_america.cli import main

if __name__ == "__main__":
    main()
