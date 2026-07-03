'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { workSeries } from '@/data/works-data';
import { asset } from '@/lib/asset';

// 只展示有图片的系列
const series = workSeries.filter((s) => s.images.length > 0);
const total = series.length;

// 每个类别的主题色（随图片风格切换）。ink = 卡片上的深色文字
type Accent = { c: string; ink: string };
const ACCENTS: Record<string, Accent> = {
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
const FALLBACK: Accent = { c: '#96bbff', ink: '#0b1030' };
const accentOf = (slug: string) => ACCENTS[slug] ?? FALLBACK;

// 左=封面(coverImg)，右=用户挑选的某张（1-based，对应 works-data 里 images 的序号）
const RIGHT_PICK: Record<string, number> = {
  tiffany: 2, // 爱琴海晨曦
  crystal: 4, // 红花碎石舞
  suyan: 1, // 风中回眸
  nuanzong: 8, // 光晕仰思
  youhua: 8, // 蜂蜜入颜来
  jiumeng: 1, // 风中回眸
  guose: 5, // 蓝莓挂枝串
  yanhu: 12, // 战斧烤肉宴
  shenglin: 19, // 四犬低头圈
};

// 特殊系列：直接指定左右两张（rose 保持原样；liuli / bantang 右图用外部上传）
const OVERRIDE: Record<string, { left: string; right: string }> = {
  rose: {
    left: '/images/rose/0684c1932e7a95a96d875bf4948dd6c8.jpg', // 蝶恋花田香
    right: '/images/rose/09002725c20ea780a3b79ed53570c8bf.jpg', // 暮色烈焰瓶
  },
  liuli: {
    left: '/images/work-6.jpg',
    right: '/images/liuli/pick-starface.jpg', // ← 用户上传：星光水下
  },
  bantang: {
    left: '/images/bantang/1e7739f4445100ea6d040b31afe5bd15.jpg',
    right: '/images/bantang/pick-cocoa.jpg', // ← 用户上传：热可可棉花糖
  },
};

// 返回某系列左右两块的图片地址
const panels = (s: (typeof series)[number]) => {
  const ov = OVERRIDE[s.slug];
  if (ov) return { L: asset(ov.left), R: asset(ov.right) };
  const idx = RIGHT_PICK[s.slug];
  const right =
    (idx ? s.images[idx - 1]?.src : undefined) ||
    s.images[1]?.src ||
    s.images[0]?.src ||
    s.coverImg;
  return { L: asset(s.coverImg), R: asset(right) };
};

const DUR = 900; // 切换动画时长(ms)
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';
const pad2 = (n: number) => String(n).padStart(2, '0');

export default function WorksPage() {
  const router = useRouter();
  const [cur, setCur] = useState(0);
  const [inc, setInc] = useState<number | null>(null); // 进入中的下一个
  const [active, setActive] = useState(false); // 动画是否已触发
  const [dir, setDir] = useState(1); // +1 下一个 / -1 上一个
  const [ready, setReady] = useState(false); // 首屏入场
  const [leaving, setLeaving] = useState(false); // 点击进入详情的转场
  const busy = useRef(false);
  const curRef = useRef(0);

  useEffect(() => {
    curRef.current = cur;
  }, [cur]);
  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // 切到目标 n，方向 d（+1 左上右下 / -1 反向）
  const run = useCallback((n: number, d: number) => {
    if (busy.current || n === curRef.current) return;
    busy.current = true;
    setDir(d);
    setInc(n);
    setActive(false);
    // 预置到位后，下一帧再触发过渡
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setActive(true))
    );
    window.setTimeout(() => {
      setCur(n);
      setInc(null);
      setActive(false);
      busy.current = false;
    }, DUR + 60);
  }, []);

  const go = useCallback(
    (d: number) => run((curRef.current + d + total) % total, d),
    [run]
  );

  // 直接跳到某个类别
  const jump = useCallback(
    (n: number) => run(n, n > curRef.current ? 1 : -1),
    [run]
  );

  // 滚轮 / 方向键切换
  useEffect(() => {
    // 进入后 500ms 内忽略滚轮，避免从别的页滚动着点进来时惯性误翻第一个
    const mountTs = performance.now();
    const onWheel = (e: WheelEvent) => {
      if (performance.now() - mountTs < 500) return;
      const dv = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(dv) < 6) return;
      go(dv > 0 ? 1 : -1);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Enter') enter();
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [go]);

  // 卡片显示：切换动画进行中即切到下一个（名称/颜色随之变化）
  const shown = inc !== null && active ? inc : cur;
  const s = series[shown];
  const accent = accentOf(s.slug);

  const enter = useCallback(() => {
    if (leaving) return;
    const target = series[curRef.current];
    setLeaving(true);
    window.setTimeout(() => router.push(`/works/${target.slug}`), 720);
  }, [leaving, router]);

  // 返回：内嵌在外壳(iframe)里则通知外壳关闭，否则回退/回首页
  const back = () => {
    if (typeof window === 'undefined') return;
    if (window.parent && window.parent !== window) {
      window.parent.postMessage('sc-close', '*');
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  const panelLayer = (side: 'L' | 'R') => {
    const sign = side === 'L' ? -1 : 1; // 左往上、右往下
    const exitTo = dir * sign * 100;
    const enterFrom = -exitTo;
    const src = (i: number) => panels(series[i])[side];
    const moving = inc !== null;
    return (
      <div className="mx-panel">
        {/* 当前层 */}
        <div
          className="mx-layer"
          style={{
            backgroundImage: `url(${src(cur)})`,
            transform: `translateY(${moving && active ? exitTo : 0}%)`,
            transition: moving && active ? `transform ${DUR}ms ${EASE}` : 'none',
          }}
        />
        {/* 进入层 */}
        {moving && (
          <div
            className="mx-layer"
            style={{
              backgroundImage: `url(${src(inc!)})`,
              transform: `translateY(${active ? 0 : enterFrom}%)`,
              transition: active ? `transform ${DUR}ms ${EASE}` : 'none',
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div
      className={`mx-viewer${ready ? ' is-ready' : ''}`}
      style={{ ['--accent' as string]: accent.c }}
    >
      {/* 左右两块图 */}
      <div className="mx-stage">
        {panelLayer('L')}
        <div className="mx-seam" />
        {panelLayer('R')}
      </div>
      <div className="mx-veil" />

      {/* 顶部：返回 + 计数 */}
      <div className="mx-top">
        <button className="mx-back" onClick={back}>
          <span>←</span> 返回
        </button>
        <span className="mx-brand">
          <b>XINGYAKAI</b> — AI VISUAL WORK
        </span>
        <span className="mx-count">
          {pad2(shown + 1)} <i>/ {pad2(total)}</i>
        </span>
      </div>

      {/* 中央：类别标签卡 */}
      <button
        className="mx-card"
        onClick={enter}
        style={{ background: accent.c, color: accent.ink }}
        aria-label={`进入 ${s.title}`}
      >
        <span className="mx-card-mono" aria-hidden>
          XYK
        </span>
        <span key={`t-${shown}`} className="mx-card-name">
          {s.title}
        </span>
        <span className="mx-card-arrow" aria-hidden>
          ↗
        </span>
        <span key={`l-${shown}`} className="mx-card-metaL">
          {s.tag}
        </span>
        <span key={`r-${shown}`} className="mx-card-metaR">
          {s.images.length} 张作品
        </span>
      </button>

      {/* 左右切换箭头 */}
      <button className="mx-nav mx-nav-prev" onClick={() => go(-1)} aria-label="上一个">
        ↑
      </button>
      <button className="mx-nav mx-nav-next" onClick={() => go(1)} aria-label="下一个">
        ↓
      </button>

      {/* 右侧类别索引 */}
      <div className="mx-dots">
        {series.map((it, i) => (
          <button
            key={it.slug}
            className={`mx-dot${i === shown ? ' on' : ''}`}
            onClick={() => jump(i)}
            aria-label={it.title}
          >
            <i>{pad2(i + 1)}</i>
            <em>{it.title}</em>
          </button>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="mx-hint">
        <span key={`h-${shown}`}>{s.description}</span>
        <span className="mx-hint-r">滚动 / ↑↓ 切换类别 · 点击进入</span>
      </div>

      {/* 进入详情转场帘 */}
      <div className={`mx-curtain${leaving ? ' on' : ''}`} style={{ background: accent.c }}>
        <span style={{ color: accent.ink }}>Entering</span>
      </div>
    </div>
  );
}
