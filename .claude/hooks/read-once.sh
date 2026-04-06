#!/usr/bin/env bash
# read-once hook — prevents Claude from re-reading files it already loaded this session.
# Measured to save ~38K tokens per session (~40-90% reduction in Read tool token usage).
# Source: github.com/Bande-a-Bonnot/Boucle-framework (adapted for this boilerplate)
#
# Registered as a PreToolUse hook in .claude/settings.json.
# Exit 0 = allow read. Exit 2 = block with message (Claude sees the message).

set -euo pipefail

INPUT=$(cat)

# Extract file_path from the tool input JSON
FILE=$(echo "$INPUT" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('file_path', ''))
except Exception:
    print('')
" 2>/dev/null || true)

# No file path found — allow the call through
if [ -z "$FILE" ]; then
    exit 0
fi

# Per-session cache keyed by CLAUDE_SESSION_ID (set by Claude Code CLI)
SESSION_ID="${CLAUDE_SESSION_ID:-default}"
CACHE="/tmp/.claude_read_once_${SESSION_ID}"

# If already seen: block and explain
if grep -Fxq "$FILE" "$CACHE" 2>/dev/null; then
    echo "read-once: already read '$FILE' this session — using cached content to save tokens"
    exit 2
fi

# First read: record and allow
echo "$FILE" >> "$CACHE"
exit 0
