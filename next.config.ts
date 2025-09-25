import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: 'https',
        
        hostname: 's3.ap-south-1.amazonaws.com',
        port: '',
        
        pathname: '/gg.skin.app/**',      },
    ],
  },
};

export default nextConfig;
