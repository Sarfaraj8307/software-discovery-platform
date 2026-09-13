import Image, { type ImageProps } from "next/image";
import { IMAGE_SIZES, type ImageSizeKey } from "@/lib/images";

/**
 * Thin wrapper over next/image that bakes in the project's default optimization
 * posture (AVIF/WebP via next.config.ts, lazy by default) and resolves `sizes`
 * from the shared map in lib/images.ts so call sites stay declarative.
 *
 * Not yet used in the UI — scaffolding for when real imagery lands. Usage:
 *
 *   <ResponsiveImage src={logo} alt="Acme" width={96} height={96} sizes="avatar" />
 *   <ResponsiveImage src={hero} alt="" fill sizes="productHero" />
 */
export function ResponsiveImage({
  sizes,
  priority = false,
  alt,
  ...props
}: ImageProps & { sizes?: ImageSizeKey | string }) {
  const resolvedSizes =
    typeof sizes === "string" && sizes in IMAGE_SIZES
      ? IMAGE_SIZES[sizes as ImageSizeKey]
      : ((sizes as string | undefined) ?? undefined);

  return (
    <Image
      alt={alt}
      {...props}
      sizes={resolvedSizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
    />
  );
}
