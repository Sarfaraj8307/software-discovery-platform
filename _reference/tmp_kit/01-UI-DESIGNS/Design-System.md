# Design System — Futuristic Software Marketplace

## Colors (copy these hex)
- `--bg: #060A1A` — page background (deep navy, not pure black, softer)
- `--card: #0F1733` — cards, panels
- `--card2: #141F45` — hover
- `--accent: #00E5FF` — cyan primary CTA, HUD lines
- `--accent2: #7C4DFF` — violet gradient partner
- `--accent3: #00FFA3` — success / check / “in comparison”
- `--text: #E6EAFF` — headings
- `--muted: #8A94B8` — body, labels
- `--border: rgba(255,255,255,0.08)` — card borders
- Glass: `backdrop-filter: blur(16px); background: rgba(15,23,51,0.6)`

## Typography (Google Fonts, free)
- Headings: `Inter` 700-800, tight tracking -0.02em
- Body: `Inter` 400/500 15px line-height 1.6
- Mono: `JetBrains Mono` for prices, specs, comparison numbers
- Load: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@500&display=swap">`

## Motion Rules (feels futuristic but not dizzy)
- Micro: 150ms ease-out (hover)
- Macro: 300ms ease-out (page transitions)
- Lottie: 30fps, loop 3s, “elastic” easing for bars
- 3D: slow (6s per rotation), mouse parallax ±5deg only
- **Never animate the comparison table rows** — keep it instant (60fps)

## Card Pattern (software listing)
- 16px radius, 1px border `rgba(255,255,255,0.08)`, shadow 0 8px 32px rgba(0,0,0,0.4)
- Logo 40x40 rounded 10px, top
- Title 16px semibold, vendor 13px muted
- 3 tags (e.g., CRM • Cloud • AI) pill `rgba(0,229,255,0.1)` border
- Price mono, CTA “Compare” outline cyan → fill on hover
- Hover: lift 4px + border cyan 20% + glow

## Comparison Table
- Sticky first column (software name + logo)
- Highlight differences in violet, equal values muted
- Up to 3 columns — 4th shows “Remove to compare” prompt
