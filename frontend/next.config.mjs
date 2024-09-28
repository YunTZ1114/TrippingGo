import dotenv from "dotenv";

const env = dotenv.config({ path: "../.env" });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${env.parsed.API_BASE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
