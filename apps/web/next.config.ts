import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // (optional) allow any Unsplash subdomain
      // { protocol: "https", hostname: "*.unsplash.com" },
    ],
  },
};

export default nextConfig;
