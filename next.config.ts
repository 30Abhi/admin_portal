import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "gg.skin.app.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "s3.ap-south-1.amazonaws.com",
        pathname: "/gg.skin.app/**",
      },
    ],
  },
  compiler: {
    // Remove all console logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
