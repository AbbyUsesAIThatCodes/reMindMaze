#!/usr/bin/env sh
cd "$(dirname "$0")" || exit 1
if command -v node >/dev/null 2>&1; then
  exec node scripts/serve.mjs
elif command -v python3 >/dev/null 2>&1; then
  echo 'Open http://localhost:4173 in your browser. Ctrl+C to stop.'
  exec python3 -m http.server 4173 --bind 127.0.0.1
else
  echo 'Install Node.js 20 or newer, or Python 3, to start the game.'
  exit 1
fi
