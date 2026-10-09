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
    "172.31.164.140",
    "172.31.2.241",
    "0.0.0.0",
    "::1",
    "*.local",
    "172.31.*",
  ],
};

export default nextConfig;
