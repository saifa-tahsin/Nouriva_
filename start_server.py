"""Launch Nouriva's Node.js server (required for Feature 4 /api/chat)."""
import os
import shutil
import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parent
os.chdir(root)
node = shutil.which("node")
if not node:
    print("Node.js 18 or newer is required for the Feature 4 AI backend.")
    print("Install it from https://nodejs.org/ and then run run.bat or node server.js.")
    sys.exit(1)
print("Nouriva is starting at http://localhost:3000")
print("Press Ctrl+C to stop the server.")
subprocess.run([node, "server.js"], cwd=root, check=False)
