// 资源路径前缀：组合站构建时（NEXT_PUBLIC_BASE_PATH=/work）给根绝对路径资源
// 加上 /work 前缀，使作品集完全自包含在 /work 目录下。标准构建时为空。
export const BP = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const asset = (p: string): string =>
  p && p.startsWith('/') ? BP + p : p;
