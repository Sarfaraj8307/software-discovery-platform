# Spline AI / Spline Prompt — Text to 3D

Spline has AI: App → AI Generate (or Magic → Prompt)

## Prompt 1 — Floating Laptop Hero (recommended)
```
Create a low-poly floating laptop, translucent glass material, slightly open 120 degrees, hovering 20cm above a dark reflective plane. Add 3 semi-transparent HUD cards orbiting it slowly. Soft point light + HDRI. Make laptop interactive: on mouse move, rotate Y slightly (range -5 to 5 degrees). Add slow float animation (Y sin wave, 6s). Export optimized for web.
```

## Prompt 2 — Glass Sphere + Computer
```
Floating glass sphere 20cm diameter, inside it a tiny laptop model, sphere has refraction 1.4, outer glow cyan, background dark navy, floor with faint grid. Interactive: drag to rotate, scroll to scale slightly.
```

## Settings after generation
- Play Settings → disable Logo, Background Color, Keep Page Scroll, Cursor Orbit (so Webflow controls scroll)
- Viewer → copy Public URL → paste in 04-INTEGRATION-CODE/spline-embed-example.html
- Performance: File → Optimize → reduce polygons to < 80k

Free tier: 3 exports/month → plan prompts carefully, remix community scenes to save quota.
Community search: https://app.spline.design/library → search “futuristic hero”, “glass laptop”, “HUD”
