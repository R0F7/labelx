import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-1945f94007a74002badd24cd665ad597.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
