import type { NextConfig } from "next";

// 组合站构建时设 NEXT_PUBLIC_BASE_PATH=/work，作品集自包含在 /work 下；
// 不设则为标准站（本地 dev / 独立部署）。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
