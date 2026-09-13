"""Verify the visual layer shipped: bundle budget + token emission.

Two checks a green build cannot give you:

  1. BUNDLE — the 1.5 MB contract is about *first load*, not the total size of
     everything in .next/static. A library can be installed and still not ship
     if nothing imports it, so this measures what the homepage really requests.

  2. TOKEN EMISSION — Tailwind v4 TREE-SHAKES @theme tokens. A token declared in
     globals.css but never referenced by a class, a utility, or a literal string
     in scanned source is NOT emitted. This is desirable (no dead CSS) but it
     means "I added the token" and "the token ships" are different claims.

     The subtlety that bit us once: lib/viz.ts holds literal class strings like
     "bg-viz-1" as data. Tailwind scans source text, so those literals cause the
     corresponding --color-viz-* tokens to be emitted even though no JSX writes
     the class. That is why the viz palette ships but the chart-chrome tokens do
     not — nothing references them yet.

     So the check is split: EMITTED_NOW must be present (something uses them),
     DECLARED_LAZY is reported for information and will appear once used.
"""
import glob
import os
import re
import sys
import urllib.error
import urllib.request

WS = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(WS)

BUDGET_KB = 1536  # 1.5 MB
BASE = "http://127.0.0.1:3000"

# ---------------------------------------------------------------- 1. bundle
try:
    with urllib.request.urlopen(BASE + "/", timeout=15) as resp:
        html = resp.read().decode("utf-8", errors="ignore")
except (urllib.error.URLError, OSError) as exc:
    print(f"FAIL: could not fetch homepage — {exc}")
    print("      (is `next start -p 3000` running?)")
    sys.exit(1)

# "/_next/static/chunks/x.js" is served from ".next/static/chunks/x.js".
srcs = sorted(set(re.findall(r'src="(/_next/static/[^"]+\.js)"', html)))
total = 0
resolved = 0
unresolved = []
for s in srcs:
    rel = s.split("?")[0]
    p = os.path.join(".next", rel.replace("/_next/", "", 1))
    if os.path.exists(p):
        total += os.path.getsize(p)
        resolved += 1
    else:
        unresolved.append(rel)

kb = total / 1024
print(f"homepage first-load JS : {resolved}/{len(srcs)} files resolved, {kb:.1f} KB")
if unresolved:
    # These are legitimately absent for on-demand chunks; listed so the number
    # above is never mistaken for "all of it".
    print(f"  not on disk ({len(unresolved)}): {', '.join(os.path.basename(u) for u in unresolved[:4])}"
          + (" …" if len(unresolved) > 4 else ""))
budget_ok = kb <= BUDGET_KB
print(f"budget                 : {BUDGET_KB} KB (1.5 MB) -> {'PASS' if budget_ok else 'FAIL'}")

# ------------------------------------------------------- 2. token emission
css_files = glob.glob(".next/static/**/*.css", recursive=True)
css = "".join(open(f, encoding="utf-8", errors="ignore").read() for f in css_files)
print(f"\nbuilt CSS              : {len(css_files)} file(s), {len(css)/1024:.1f} KB")

# Must be present: each of these is referenced by real component source today.
EMITTED_NOW = [
    "--color-viz-1",            # palette (literal classes in lib/viz.ts)
    "--color-viz-10-fg",
    "--duration-slower",        # :root duration tokens
    "--ease-out-quiet",
    "--background-image-gradient-aurora",    # hero backdrop
    "--background-image-gradient-spectrum",  # spectrum-rule
    "bg-viz-1",
    "text-viz-1-fg",            # hero eyebrow
    "viz-grid",                 # hero backdrop
    "spectrum-rule",            # hero eyebrow rule
    "ring-draw",                # ScoreRing keyframe
    "bar-grow",                 # ScoreBar keyframe
    "metric-in",                # AnimatedMetric
    "float-drift",              # ambient drift
]

# Declared in @theme, not yet referenced anywhere. Tailwind will emit these the
# moment something uses them. Reported, never a failure — flagging them as
# missing would train us to ignore this check.
DECLARED_LAZY = [
    "--color-chart-grid",
    "--color-chart-axis",
    "--color-chart-tooltip",
    "--viz3d-node",
    "--ease-spring",
    "--ease-in-out-quiet",
    "--ease-drift",
    "--background-image-gradient-score",
    "--background-image-gradient-plate",
]

missing = [t for t in EMITTED_NOW if t not in css]
lazy = [t for t in DECLARED_LAZY if t not in css]
shipped = [t for t in DECLARED_LAZY if t in css]

print(f"tokens in use          : {len(EMITTED_NOW) - len(missing)}/{len(EMITTED_NOW)} emitted")
if missing:
    print("  MISSING (should be present — something references these):")
    for m in missing:
        print("   -", m)
else:
    print("  all in-use tokens emitted")

print(f"tokens declared, unused: {len(lazy)} of {len(DECLARED_LAZY)} await first use")
if shipped:
    print(f"  (already emitted: {', '.join(shipped)})")

ok = budget_ok and not missing
print("\nRESULT:", "PASS" if ok else "FAIL")
sys.exit(0 if ok else 1)
