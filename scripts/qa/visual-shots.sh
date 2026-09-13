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
#   - Never call agent-browser directly — go through scripts/qa/ab.sh, which strips
#     HTTP_PROXY (the daemon hangs on localhost) and NODE_OPTIONS (the sandbox's
#     node-language-shim is inherited by agent-browser's internal Node child and
#     eventually hangs it, with no error).
#   - The daemon is persistent: open once, `set viewport` + screenshot per route, close
#     once at the end. Do NOT open/close per route.
#   - `wait --load networkidle` can stall; `wait 1200` is a safer fixed settle.
set -uo pipefail

AB="scripts/qa/ab.sh"

BASE="${1:-http://127.0.0.1:3000}"
TAG="${3:-baseline}"
OUT="${2:-qa-screenshots/$TAG}"

mkdir -p "$OUT"

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
sh "$AB" open "$BASE/" >/dev/null 2>&1
sh "$AB" set viewport 1440 900 >/dev/null 2>&1

for entry in "${ROUTES[@]}"; do
  route="${entry%%:*}"; name="${entry##*:}"
  sh "$AB" open "$BASE$route" >/dev/null 2>&1
  sh "$AB" wait 1200 >/dev/null 2>&1
  sh "$AB" screenshot --full "$OUT/1440-$name.png" >/dev/null 2>&1
  printf '  %-22s %s\n' "$name" "$([ -f "$OUT/1440-$name.png" ] && echo ok || echo FAIL)"
done

# Responsive pass on the homepage
echo "==> responsive pass (home) -> $OUT"
for vp in "1280 800" "1024 768" "768 1024" "390 844"; do
  set -- $vp
  sh "$AB" set viewport "$1" "$2" >/dev/null 2>&1
  sh "$AB" open "$BASE/" >/dev/null 2>&1
  sh "$AB" wait 1200 >/dev/null 2>&1
  sh "$AB" screenshot --full "$OUT/$1-home.png" >/dev/null 2>&1
  printf '  %-22s %s\n' "$1x$2" "$([ -f "$OUT/$1-home.png" ] && echo ok || echo FAIL)"
done

sh "$AB" close >/dev/null 2>&1

echo "==> captured $(find "$OUT" -name '*.png' | wc -l) screenshots in $OUT"
