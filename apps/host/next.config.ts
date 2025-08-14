import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/auth",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3007/auth"
            : "https://whispr-auth.vercel.app/auth",
      },
      {
        source: "/auth/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3007/auth/:path*"
            : "https://whispr-auth.vercel.app/auth/:path*",
      },
    ];
  },
};

export default nextConfig;
