import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol : "https",
        hostname:"sm.ign.com",
        port:""
      }
    ]
  }
};

export default nextConfig;
