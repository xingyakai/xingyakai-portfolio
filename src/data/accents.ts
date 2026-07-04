// 各作品系列的主题色（滑块封面卡片 + 详情页共用，保证内外一致）
// c   = 鲜明主色（进度条、圆点、下划线、按钮 hover 底色等）
// ink = 深色版（浅底上的文字，保证对比度）
export type Accent = { c: string; ink: string };

export const ACCENTS: Record<string, Accent> = {
  tiffany:  { c: '#5ec4bd', ink: '#0d2b28' },
  rose:     { c: '#c76f89', ink: '#2c0f19' },
  crystal:  { c: '#e2823f', ink: '#2b1204' },
  liuli:    { c: '#3ea3c9', ink: '#05222f' },
  suyan:    { c: '#cf9c86', ink: '#2b170f' },
  nuanzong: { c: '#b1774b', ink: '#241205' },
  youhua:   { c: '#d7a63a', ink: '#2a1d03' },
  jiumeng:  { c: '#b0895a', ink: '#241505' },
  bantang:  { c: '#e0956f', ink: '#2c1206' },
  guose:    { c: '#86a24f', ink: '#16210a' },
  yanhu:    { c: '#cf6f43', ink: '#2a1105' },
  shenglin: { c: '#b98a52', ink: '#241604' },
};

export const FALLBACK_ACCENT: Accent = { c: '#96bbff', ink: '#0b1030' };

export const accentOf = (slug: string): Accent => ACCENTS[slug] ?? FALLBACK_ACCENT;
