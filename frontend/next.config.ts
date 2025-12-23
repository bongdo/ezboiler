import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // output: 'export' does not support rewrites
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://127.0.0.1:8080/api/:path*',
  //     },
  //   ];
  // },
};

export default nextConfig;
