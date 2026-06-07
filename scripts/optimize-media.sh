#!/bin/bash
# optimize-media.sh
# Hook script: auto-compresses media files written to the project.
# Called by Cursor hooks (afterFileEdit / preToolUse post-filter).
# Usage: ./scripts/optimize-media.sh <file1> [file2 ...]

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [ $# -eq 0 ]; then
  exit 0
fi

echo "🔧 Media optimizer: processing $(basename "$1")..."

node "$ROOT/scripts/optimize-media.mjs" "$@"
