#!/usr/bin/env bash
# Capture the visual baseline for the visual-transformation program.
#
# Usage:
#   bash scripts/qa/visual-shots.sh [base-url] [out-dir] [tag]
#
# Defaults: http://127.0.0.1:3000  qa-screenshots/<tag>  baseline
#
# Why a script: the transformation program requires a screenshot -> inspect -> fix
# loop per phase. Re-running this after each phase gives a comparable before/after set.
#
# Notes learned the hard way:
#   - agent-browser HANGS behind HTTP_PROXY when talking to 127.0.0.1. Proxy vars are
#     stripped for the localhost calls below.
#   - The daemon is persistent: open once, `set viewport` + screenshot per route, close
#     once at the end. Do NOT open/close per route.
#   - `wait --load networkidle` can stall; `wait 1200` is a safer fixed settle.
set -uo pipefail

BASE="${1:-http://127.0.0.1:3000}"
TAG="${3:-baseline}"
OUT="${2:-qa-screenshots/$TAG}"

mkdir -p "$OUT"

# Strip proxy so localhost traffic never goes through it.
unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy ALL_PROXY all_proxy

ROUTES=(
  "/:home"
  "/categories:categories"
  "/categories/crm:category-crm"
  "/product/salesforce-sales-cloud:product"
  "/search:search"
  "/compare:compare-hub"
  "/compare/quickbooks-online-vs-wave:compare-detail"
  "/graph:graph"
  "/login:login"
  "/methodology:methodology"
  "/about:about"
  "/vendor:vendor"
  "/admin:admin"
)

# Desktop pass
echo "==> desktop 1440x900 -> $OUT"
agent-browser open "$BASE/" >/dev/null 2>&1
agent-browser set viewport 1440 900 >/dev/null 2>&1

for entry in "${ROUTES[@]}"; do
  route="${entry%%:*}"; name="${entry##*:}"
  agent-browser open "$BASE$route" >/dev/null 2>&1
  agent-browser wait 1200 >/dev/null 2>&1
  agent-browser screenshot --full "$OUT/1440-$name.png" >/dev/null 2>&1
  printf '  %-22s %s\n' "$name" "$([ -f "$OUT/1440-$name.png" ] && echo ok || echo FAIL)"
done

# Responsive pass on the homepage
echo "==> responsive pass (home) -> $OUT"
for vp in "1280 800" "1024 768" "768 1024" "390 844"; do
  set -- $vp
  agent-browser set viewport "$1" "$2" >/dev/null 2>&1
  agent-browser open "$BASE/" >/dev/null 2>&1
  agent-browser wait 1200 >/dev/null 2>&1
  agent-browser screenshot --full "$OUT/$1-home.png" >/dev/null 2>&1
  printf '  %-22s %s\n' "$1x$2" "$([ -f "$OUT/$1-home.png" ] && echo ok || echo FAIL)"
done

agent-browser close >/dev/null 2>&1

echo "==> captured $(find "$OUT" -name '*.png' | wc -l) screenshots in $OUT"
