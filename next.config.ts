import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Image optimization — scaffolding for when real product/category imagery lands.
  // next/image is not yet used in the UI; this config makes the later swap drop-in.
  // Replace the placeholder hostname with the real asset host (e.g. your CDN).
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.software-discovery.example", pathname: "/**" },
    ],
    deviceSizes: [390, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Pin the workspace root. Without this, Next walks up to the user's home directory
  // looking for a lockfile and picks up an unrelated one.
  turbopack: {
    root: path.resolve(process.cwd()),
  },

  experimental: {
    // lucide-react ships thousands of modules; this keeps the client bundle to the
    // icons actually imported.
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
