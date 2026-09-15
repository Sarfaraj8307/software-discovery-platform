#!/usr/bin/env bash
# Regenerate the codebase knowledge graph with Graphify and publish it into the app.
#
# Graphify (https://github.com/Graphify-Labs/graphify) turns this project's source into a
# traversable knowledge graph using local tree-sitter AST parsing (no LLM / API key needed
# in --code-only mode). It honours .gitignore, so node_modules/ and .next/ are skipped.
#
# The published artifact lives in public/graphify/ and is embedded by app/graph/page.tsx.
# The published files ARE tracked in git so a fresh clone ships with the knowledge graph.
# graphify-out/ (the raw tool output) is ignored; this script copies from it into public/.
set -euo pipefail

WS="$(cd "$(dirname "$0")/.." && pwd)"
cd "$WS"

VENV="$WS/.venv-graphify/Scripts/python.exe"
if [ ! -x "$VENV" ]; then
  echo "Graphify venv not found at $VENV" >&2
  echo "Install it once with:" >&2
  echo "  python -m venv .venv-graphify && .venv-graphify/Scripts/python.exe -m pip install \"git+https://github.com/Graphify-Labs/graphify.git@v8\"" >&2
  exit 1
fi

echo "==> Extracting codebase graph (AST-only, gitignored dirs skipped) ..."
"$VENV" -m graphify extract . --code-only

echo "==> Publishing graph.html + graph.json into public/graphify/ ..."
mkdir -p public/graphify
cp graphify-out/graph.html public/graphify/graph.html
cp graphify-out/graph.json  public/graphify/graph.json 2>/dev/null || true

# graphify 0.9.61 emits vis-network as an external unpkg CDN tag; the artifact is meant
# to be self-contained. This replaces it with the pinned 9.1.6 library. Idempotent.
echo "==> Inlining the visualisation library (restoring self-containment) ..."
node scripts/inline-graph-lib.mjs

echo "Done. Open http://127.0.0.1:3120/graph (or /graphify/graph.html) to view."
