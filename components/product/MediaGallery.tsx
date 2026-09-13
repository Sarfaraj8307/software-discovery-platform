import type { ProductScreenshot } from "@/lib/data/types";
import { ScreenshotPlate } from "@/components/product/ScreenshotPlate";
import { ScreenshotFrame } from "@/components/product/ScreenshotFrame";

/**
 * Screenshot gallery.
 *
 * No binary assets ship in this build, so each frame renders a procedural
 * product-UI plate instead of a photograph. The layout is final: swapping in
 * real captures later is a one-component change with no reflow, because the
 * plate and a real image would occupy the identical 16:10 box.
 *
 * This is a server component. Only `ScreenshotFrame` (the lightbox) is a client
 * component, and it receives each plate as `children` so the SVG is generated on
 * the server rather than shipped as JavaScript.
 */
export function MediaGallery({
  screenshots,
  productName,
}: {
  screenshots: ProductScreenshot[];
  productName: string;
}) {
  if (screenshots.length === 0) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {screenshots.map((shot) => (
        <li key={shot.id}>
          <ScreenshotFrame
            caption={shot.caption}
            title={`${productName} — ${shot.caption}`}
            description="Illustrative interface rendering. This listing uses a synthetic demo dataset, so no real product captures are shown."
          >
            <ScreenshotPlate seed={`${productName}-${shot.id}`} />
          </ScreenshotFrame>
        </li>
      ))}
    </ul>
  );
}
