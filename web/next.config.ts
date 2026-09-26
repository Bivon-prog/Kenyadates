import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Allow network access for local testing (e.g. from a mobile phone on the same WiFi)
  allowedDevOrigins: ["localhost", "127.0.0.1", "172.31.30.232", "0.0.0.0", "::1"],
};

export default nextConfig;
