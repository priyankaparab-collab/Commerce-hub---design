import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProd ? "/Commerce-hub---design" : "",
  assetPrefix: isProd ? "/Commerce-hub---design/" : "",
};

export default nextConfig;
