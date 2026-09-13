#!/usr/bin/env bash
# Capture a single route for a phase gate.
#
# Usage: bash scripts/qa/shot-route.sh <route> <tag> [width] [height] [full|viewport]
#
#   bash scripts/qa/shot-route.sh /product/salesforce-sales-cloud w5-product 1440 900 full
#
# Kept separate from visual-shots.sh (which walks all 13 routes) so a single-page
# change can be verified in seconds instead of minutes.
#
# Same two gotchas as visual-shots.sh:
#   - agent-browser HANGS behind HTTP_PROXY on localhost, so proxy vars are stripped.
#   - The daemon is persistent; open once, resize, shoot. Never open/close per shot.
set -uo pipefail

ROUTE="${1:?route required}"
TAG="${2:?tag required}"
W="${3:-1440}"
H="${4:-900}"
MODE="${5:-full}"
BASE="${BASE:-http://127.0.0.1:3000}"

OUT="qa-screenshots/$TAG"
mkdir -p "$OUT"

SLUG="$(printf '%s' "$ROUTE" \
  | sed 's|^/||' \
  | sed 's|[?&]|-|g' \
  | sed 's|/|_|g' \
  | sed 's|[^A-Za-z0-9._-]|_|g' \
  | sed 's|^$|home|')"
FILE="$OUT/${W}-${SLUG}.png"

FLAGS="--full"
[ "$MODE" = "viewport" ] && FLAGS=""

sh "$AB" open "$BASE$ROUTE" >/dev/null 2>&1
sh "$AB" set viewport "$W" "$H" >/dev/null 2>&1
sh "$AB" wait 1500 >/dev/null 2>&1
# shellcheck disable=SC2086
sh "$AB" screenshot $FLAGS "$FILE" >/dev/null 2>&1
sh "$AB" close >/dev/null 2>&1

if [ -f "$FILE" ]; then
  echo "ok   $ROUTE -> $FILE ($(wc -c < "$FILE") bytes)"
else
  echo "FAIL $ROUTE"
  exit 1
fi
