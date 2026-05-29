import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "**.media-amazon.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
