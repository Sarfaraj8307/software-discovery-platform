def lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def L(hexs):
    h = hexs.lstrip('#')
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def cr(a, b):
    la, lb = L(a), L(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


WHITE = "#ffffff"
TINTS = {
    "blue": "#eff6ff", "cyan": "#ecfeff", "violet": "#f5f3ff", "emerald": "#ecfdf5",
    "amber": "#fffbeb", "rose": "#fff1f2", "indigo": "#eef2ff", "teal": "#f0fdfa",
    "fuchsia": "#fdf4ff", "slate": "#f8fafc",
}
CANDS = {
    "blue": ("#2563EB", "#1D4ED8"),
    "cyan": ("#0891B2", "#0E7490"),
    "violet": ("#7C3AED", "#6D28D9"),
    "emerald": ("#059669", "#047857"),
    "amber": ("#D97706", "#B45309"),
    "rose": ("#E11D48", "#BE123C"),
    "indigo": ("#4F46E5", "#4338CA"),
    "teal": ("#0D9488", "#0F766E"),
    "fuchsia": ("#C026D3", "#A21CAF"),
    "slate": ("#475569", "#334155"),
}

print(f"{'token':9s} {'solid':8s} {'vsW':>6s} {'textfg':8s} {'vsW':>6s} {'vsTint':>7s}  verdict")
fails = []
for name, (solid, textsafe) in CANDS.items():
    a = cr(solid, WHITE)
    b = cr(textsafe, WHITE)
    c = cr(textsafe, TINTS[name])
    ok_g = a >= 3.0
    ok_t = b >= 4.5
    ok_tt = c >= 4.5
    if not (ok_g and ok_t and ok_tt):
        fails.append(name)
    print(f"{name:9s} {solid:8s} {a:6.2f} {textsafe:8s} {b:6.2f} {c:7.2f}  "
          f"{'graphical' if ok_g else 'G-FAIL'} / {'AA' if ok_t else 'T-FAIL'} / {'AA-tint' if ok_tt else 'TINT-FAIL'}")

print()
print("FAILURES:", fails if fails else "none — all 10 pass graphical 3:1 and AA text 4.5:1 on white and on tint")
