import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BUILD_SHA:
      process.env.COMMIT_REF ?? process.env.GITHUB_SHA ?? process.env.NEXT_PUBLIC_BUILD_SHA ?? "unknown",
  },
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
