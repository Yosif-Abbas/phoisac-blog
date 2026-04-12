import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 80, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cifmmxhmdygikfucbneh.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
  cacheComponents: true,
};

export default nextConfig;
