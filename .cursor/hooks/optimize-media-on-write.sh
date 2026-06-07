#!/bin/bash
# optimize-media-on-write.sh
# Cursor hook: runs after a file is written via the Write tool.
# Checks if the file is a media file and runs it through the optimizer.
#
# Hook event: postToolUse (matcher: Write)
# Hook input on stdin: JSON with tool_call and result fields

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

# Read hook input from stdin
INPUT=$(cat)

# Extract the file path from tool_call arguments (Write tool writes to "path")
FILE_PATH=$(echo "$INPUT" | node -e "
  let d = '';
  process.stdin.on('data', c => d += c);
  process.stdin.on('end', () => {
    try {
      const j = JSON.parse(d);
      console.log(j.tool_call?.arguments?.path || '');
    } catch {}
  });
")

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Normalize
FILE_PATH="$ROOT/$(echo "$FILE_PATH" | sed "s|^$ROOT/||")"

# Only process files inside the project
case "$FILE_PATH" in
  "$ROOT"/*) ;;
  *) exit 0 ;;
esac

# Skip files already in public/media/ (prevent re-processing)
case "$FILE_PATH" in
  "$ROOT/public/media/"*) exit 0 ;;
esac

# Check if file exists and is non-empty
if [ ! -f "$FILE_PATH" ] || [ ! -s "$FILE_PATH" ]; then
  exit 0
fi

# Run the optimizer — use timeout to prevent hooks from hanging
timeout 30 node "$ROOT/scripts/optimize-media.mjs" "$FILE_PATH" 2>&1 || true
