#!/usr/bin/env sh
# Horizontal-overflow check across breakpoints.
#
# WHY window.scrollX AND NOT documentElement.scrollWidth
#   With `position: sticky` anywhere in the tree, scrollWidth reports the sticky
#   element's containing block rather than the real overflow and under-reports.
#   Scrolling to an absurd x and reading back scrollX is the only honest test —
#   if the document can move right, it has overflow.
#
# Requires a production server on :3000 and scripts/qa/ab.sh.
#   PORT=3000 sh scripts/qa/overflow.sh
set -eu

PORT="${PORT:-3000}"
AB="scripts/qa/ab.sh"
ROUTES="${ROUTES:-/ /categories /compare /product/hubspot-marketing-hub /search?q=pricing}"
WIDTHS="${WIDTHS:-1440 1024 768 390}"

PASS=0
FAIL=0

for W in $WIDTHS; do
  sh "$AB" set viewport "$W" 900 >/dev/null
  for R in $ROUTES; do
    sh "$AB" open "http://127.0.0.1:$PORT$R" >/dev/null
    sh "$AB" wait 700 >/dev/null
    RAW=$(sh "$AB" eval "(()=>{window.scrollTo(9999,0);var x=Math.round(window.scrollX);window.scrollTo(0,0);return x;})()")
    # agent-browser echoes JSON-quoted scalars; strip quotes and whitespace.
    X=$(printf '%s' "$RAW" | tr -d '"' | tr -d '[:space:]')
    if [ "$X" = "0" ]; then
      PASS=$((PASS + 1))
      printf '  ok   %-5s %s\n' "$W" "$R"
    else
      FAIL=$((FAIL + 1))
      printf '  FAIL %-5s overflow %spx  %s\n' "$W" "$X" "$R"
    fi
  done
done

echo
echo "OVERFLOW PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] || exit 1
