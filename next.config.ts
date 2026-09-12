import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

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
