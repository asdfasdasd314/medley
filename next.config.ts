import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next may initialize against localhost while the app is opened at its
  // equivalent loopback address. Allow both names to keep the dev HMR socket
  // available in that case.
  allowedDevOrigins: ["localhost", "127.0.0.1"],
};

export default nextConfig;
