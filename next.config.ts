import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.beekka.com" },
      { protocol: "https", hostname: "**.beekka.com" },
      { protocol: "https", hostname: "www.ruanyifeng.com" },
      { protocol: "https", hostname: "**.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
