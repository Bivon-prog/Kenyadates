import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false,
  // Allow all network IP origins for cross-device testing from phone / local network
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "172.31.133.149",
    "172.31.64.58",
    "172.31.38.51",
    "172.31.30.232",
    "0.0.0.0",
    "::1",
    "*.local",
  ],
};

export default nextConfig;
