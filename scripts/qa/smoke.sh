#!/bin/sh
# Route smoke test. Requires a production server already running:
#   npm run build && npm run start -- -p 3000
#   PORT=3000 sh scripts/qa/smoke.sh
#
# Every route module under app/ is asserted, plus the canonical trailing-slash
# redirect (308, not 301 — Next emits 308) and a 404 for an invented path.
# curl-only, so it has no dependency on a browser driver.
B="http://127.0.0.1:${PORT:-3000}"
PASS=0
FAIL=0

check() {
  code=$(curl -s -o /dev/null -w '%{http_code}' --noproxy '*' --max-time 15 "$B$1")
  if [ "$code" = "$2" ]; then
    PASS=$((PASS + 1))
    printf '  ok   %-3s %s\n' "$code" "$1"
  else
    FAIL=$((FAIL + 1))
    printf '  FAIL %-3s (want %s) %s\n' "$code" "$2" "$1"
  fi
}

echo "== static / server-rendered =="
check / 200
check /about 200
check /categories 200
check /compare 200
check /methodology 200
check /privacy 200
check /search 200
check /terms 200

echo "== dynamic =="
check /categories/marketing-automation 200
check /product/hubspot-marketing-hub 200
check /compare/hubspot-crm-vs-hubspot-marketing-hub 200
check /compare/github-actions-vs-hubspot-crm-vs-hubspot-marketing-hub-vs-salesforce-field-service 200

echo "== vendor =="
check /vendor 200
check /vendor/leads 200
check /vendor/products 200
check /vendor/reviews 200

echo "== admin =="
check /admin 200
check /admin/leads 200
check /admin/moderation 200
check /admin/seo 200

echo "== api + meta =="
check "/api/search?q=hub" 200
check /robots.txt 200
check /sitemap.xml 200

echo "== canonical redirect + 404 =="
check /about/ 308
check /this-does-not-exist-xyz 404

echo
echo "PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] || exit 1
