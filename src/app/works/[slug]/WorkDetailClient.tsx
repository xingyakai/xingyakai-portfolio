'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { workSeries, WorkImage } from '@/data/works-data';
import { asset } from '@/lib/asset';
import { accentOf } from '@/data/accents';

export default function WorkDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const slug    = params?.slug as string;
  const series  = workSeries.find(w => w.slug === slug);

  const [selected, setSelected]         = useState<WorkImage | null>(null);
  const [promptTab, setPromptTab]       = useState<'positive' | 'negative'>('positive');
  const [modalVisible, setModalVisible] = useState(false);
  // 大胆版为默认；URL 带 ?bold=0 可回看克制版
  const [bold, setBold] = useState(true);
  useEffect(() => {
    setBold(new URLSearchParams(window.location.search).get('bold') !== '0');
  }, []);

  const trackRef        = useRef<HTMLDivElement>(null);
  const currentRef      = useRef(0);
  const targetRef       = useRef(0);
  const singleWidthRef  = useRef(0);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const counterRef      = useRef<HTMLDivElement>(null);
  // 每张图的主色缓存（src → [r,g,b]），用于背景随图动态变化
  const colorCache      = useRef<Map<string, [number, number, number]>>(new Map());

  // Render images 3× for seamless infinite loop
  const tripleImages = series && series.images.length > 0
    ? [...series.images, ...series.images, ...series.images]
    : [];

  // ── 提取每张图的主色（缩到 12×12 取平均，同源无跨域，算一次缓存）──
  useEffect(() => {
    if (!series || series.images.length === 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = 12; canvas.height = 12;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    let cancelled = false;
    series.images.forEach((im) => {
      const src = asset(im.src);
      if (colorCache.current.has(src)) return;
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        if (cancelled) return;
        try {
          ctx.clearRect(0, 0, 12, 12);
          ctx.drawImage(img, 0, 0, 12, 12);
          const d = ctx.getImageData(0, 0, 12, 12).data;
          let r = 0, g = 0, b = 0, n = 0;
          for (let i = 0; i < d.length; i += 4) {
            if (d[i + 3] < 8) continue;
            r += d[i]; g += d[i + 1]; b += d[i + 2]; n++;
          }
          if (n > 0) colorCache.current.set(src, [r / n, g / n, b / n]);
        } catch { /* 跨域/解码失败则跳过，背景回退类别色 */ }
      };
      img.src = src;
    });
    return () => { cancelled = true; };
  }, [series]);

  // ── Scroll engine with infinite loop ────────────────────────
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !series || series.images.length === 0) return;

    let raf: number;
    let initialized = false;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // 背景随当前图主色平滑变化
    const rootEl = track.closest('.work-detail') as HTMLElement | null;
    let bR = -1, bG = -1, bB = -1;
    const hexToRgb = (h: string) => {
      const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(h.trim());
      return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
    };
    // 轻度提饱和：整图平均色偏灰，拉开与灰度的距离让颜色更“读得出”（不改亮度、不变重）
    const clamp = (x: number) => (x < 0 ? 0 : x > 255 ? 255 : x);
    const saturate = (c: [number, number, number], f: number): [number, number, number] => {
      const l = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
      return [clamp(l + (c[0] - l) * f), clamp(l + (c[1] - l) * f), clamp(l + (c[2] - l) * f)];
    };

    // Hover listeners
    const addHoverListeners = () => {
      track.querySelectorAll<HTMLElement>('.detail-item').forEach(item => {
        item.addEventListener('mouseenter', () => item.classList.add('is-hovered'));
        item.addEventListener('mouseleave', () => item.classList.remove('is-hovered'));
      });
    };
    addHoverListeners();

    const tick = () => {
      // Init: measure sw via offsetLeft diff (exact, no float rounding)
      // Track has images×3; second copy starts at index images.length
      if (!initialized) {
        const allItems = track.querySelectorAll<HTMLElement>('.detail-item');
        const n = series.images.length;
        if (allItems.length >= 2 * n && allItems[n]) {
          const sw = allItems[n].offsetLeft - allItems[0].offsetLeft;
          if (sw > 0) {
            singleWidthRef.current = sw;
            currentRef.current = sw;
            targetRef.current  = sw;
            initialized = true;
          }
        }
      }

      currentRef.current = lerp(currentRef.current, targetRef.current, 0.08);

      // ── Infinite loop: silently teleport when crossing set boundary ──
      const sw = singleWidthRef.current;
      if (sw > 0) {
        if (currentRef.current >= sw * 2) {
          currentRef.current -= sw;
          targetRef.current  -= sw;
        } else if (currentRef.current < 0) {
          currentRef.current += sw;
          targetRef.current  += sw;
        }
      }

      track.style.transform = `translate3d(${-currentRef.current}px, 0, 0)`;

      const vCenter = window.innerWidth / 2;
      const items   = track.querySelectorAll<HTMLElement>('.detail-item');
      let closestIdx = 0, closestDist = Infinity;

      items.forEach((item, i) => {
        const rect       = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const distance   = Math.abs(itemCenter - vCenter);
        const maxDist    = window.innerWidth * 0.85;
        const progress   = Math.max(0, 1 - distance / maxDist);

        // Scale + hover boost (wider range for more drama)
        const baseScale   = 0.5 + progress * 0.5;
        const isHovered   = item.classList.contains('is-hovered');
        const targetScale = isHovered ? baseScale + 0.07 : baseScale;
        const prevScale   = item.dataset.scale ? parseFloat(item.dataset.scale) : baseScale;
        const newScale    = lerp(prevScale, targetScale, 0.1);
        item.dataset.scale = String(newScale);
        item.style.transform = `scale(${newScale})`;

        // Brightness
        const img = item.querySelector<HTMLElement>('.detail-item-img');
        if (img) {
          const targetB  = isHovered ? 1.0 : (0.35 + progress * 0.45);
          const m        = img.style.filter.match(/brightness\(([^)]+)\)/);
          const currentB = m ? parseFloat(m[1]) : 0.35;
          img.style.filter = `brightness(${lerp(currentB, targetB, 0.12)})`;
        }

        // B: 同色柔光 —— 从每张图向四周晕出它自己的主色，越居中越强
        const gcol = colorCache.current.get(asset(series.images[i % series.images.length].src));
        if (gcol) {
          const [gr, gg, gb] = saturate(gcol, 1.5);
          const a = (0.10 + progress * 0.5).toFixed(2);
          const blur = Math.round(30 + progress * 60);
          const spread = Math.round(progress * 14);
          item.style.boxShadow = `0 0 ${blur}px ${spread}px rgba(${Math.round(gr)}, ${Math.round(gg)}, ${Math.round(gb)}, ${a})`;
        }

        if (distance < closestDist) { closestDist = distance; closestIdx = i; }
      });

      items.forEach((item, i) => item.classList.toggle('is-centered', i === closestIdx));

      // Progress: based on position within current single set
      if (progressFillRef.current && sw > 0) {
        const posInSet = ((currentRef.current - sw) % sw + sw) % sw;
        progressFillRef.current.style.width = `${(posInSet / sw) * 100}%`;
      }

      // Counter: real image index (mod original length)
      if (counterRef.current && series.images.length > 0) {
        const realIdx = closestIdx % series.images.length;
        const n       = String(realIdx + 1).padStart(2, '0');
        const total   = String(series.images.length).padStart(2, '0');
        counterRef.current.textContent = `${n} / ${total}`;
      }

      // 背景：当前居中图的主色 → 平滑过渡 → --art-bg（染色公式在 CSS 里，此处只给源色）
      if (rootEl && series.images.length > 0) {
        const realIdx = closestIdx % series.images.length;
        const raw = colorCache.current.get(asset(series.images[realIdx].src));
        if (raw) {
          const col = saturate(raw, 1.5);
          if (bR < 0) {
            const p = hexToRgb(getComputedStyle(rootEl).getPropertyValue('--accent'));
            if (p) { bR = p.r; bG = p.g; bB = p.b; }
            else { bR = col[0]; bG = col[1]; bB = col[2]; }
          }
          bR = lerp(bR, col[0], 0.08);
          bG = lerp(bG, col[1], 0.08);
          bB = lerp(bB, col[2], 0.08);
          rootEl.style.setProperty('--art-bg', `rgb(${Math.round(bR)}, ${Math.round(bG)}, ${Math.round(bB)})`);
          // 大胆版用：按主色亮度决定文字黑/白
          const L = 0.299 * bR + 0.587 * bG + 0.114 * bB;
          rootEl.style.setProperty('--art-fg', L > 148 ? '#181818' : '#ffffff');
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Wheel — no clamping for infinite loop
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetRef.current += e.deltaY + e.deltaX;
    };
    window.addEventListener('wheel', onWheel, { passive: false });

    // Keyboard
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key === 'ArrowRight') targetRef.current += 420;
      if (e.key === 'ArrowLeft')  targetRef.current -= 420;
    };
    window.addEventListener('keydown', onKeyDown);

    // Mouse drag
    let isDragging = false, dragStartX = 0, dragStartTarget = 0;
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true; dragStartX = e.clientX; dragStartTarget = targetRef.current;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      targetRef.current = dragStartTarget + (dragStartX - e.clientX) * 1.8;
    };
    const onMouseUp = () => { isDragging = false; };
    track.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartX = e.touches[0].clientX; };
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault();
      const dx = touchStartX - e.touches[0].clientX;
      touchStartX = e.touches[0].clientX;
      targetRef.current += dx * 1.5;
    };
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove',  onTouchMove,  { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [series]);

  const openModal = (img: WorkImage) => {
    setSelected(img);
    setPromptTab('positive');
    setModalVisible(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setModalVisible(true)));
  };
  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelected(null), 400);
  };

  if (!series) return null;

  const accent = accentOf(slug);

  const goBack = () => {
    // 回到作品集类别选择（滑块）。优先用历史（保留原类别位置），否则直接去 /works
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/works');
    }
  };

  return (
    <div
      className="work-detail"
      data-bold={bold || undefined}
      style={{
        ['--accent' as string]: accent.c,
        ['--accent-ink' as string]: accent.ink,
      }}
    >
      {/* ── 悬浮返回按钮（始终可见）→ 回到类别选择 ── */}
      <button className="detail-back-btn" onClick={goBack}>
        <span className="back-arrow">←</span> 返回作品集
      </button>

      {/* ── Gallery ── */}
      <section className="h-scroll-section">
        <div ref={trackRef} className="h-scroll-track">
          {tripleImages.map((img, i) => {
            // Use original index so every copy gets identical size pattern
            const origIdx      = i % series.images.length;
            const sizeVariant  = (origIdx % 5) + 1;
            const isLastInCopy = origIdx === series.images.length - 1;
            return (
            <div
              key={i}
              className={`detail-item detail-item--${sizeVariant}`}
              onClick={() => openModal(img)}
              style={{ cursor: 'pointer', ...(isLastInCopy ? { marginRight: '5vw' } : {}) }}
            >
              <img src={asset(img.src)} alt={img.title} className="detail-item-img" />
              <div className="work-item-content">
                <div className="work-item-tag">
                  <span className="work-dot" />
                  {series.tag}
                </div>
                <h2 className="work-item-title">{img.title}</h2>
              </div>
            </div>
            );
          })}
        </div>

        <div className="gallery-progress">
          <div ref={progressFillRef} className="gallery-progress-fill" />
        </div>
        <div ref={counterRef} className="gallery-counter">
          01 / {String(series.images.length).padStart(2, '0')}
        </div>
      </section>

      {/* ── Bottom info ── */}
      <section className="about-section">
        <div>
          <p className="about-label">{series.tag}</p>
          <h2 className="about-big">{series.title}</h2>
        </div>
        <div>
          <p className="about-body">{series.description}</p>
          <button
            className="about-cta"
            style={{ background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer' }}
            onClick={goBack}
          >
            ← 返回作品集
          </button>
        </div>
        <footer className="footer" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <span>点击图片查看提示词</span>
          <span>{series.images.length} 作品</span>
        </footer>
      </section>

      {/* ── Prompt Modal ── */}
      {selected && (
        <div
          className={`prompt-modal-backdrop${modalVisible ? ' visible' : ''}`}
          onClick={closeModal}
        >
          <div
            className={`prompt-modal${modalVisible ? ' visible' : ''}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="prompt-modal-img-wrap">
              <img src={asset(selected.src)} alt={selected.title} className="prompt-modal-img" />
            </div>
            <div className="prompt-modal-content">
              <div className="prompt-modal-top">
                <h2 className="prompt-modal-title">{selected.title}</h2>
                <button className="prompt-modal-close" onClick={closeModal}>✕</button>
              </div>
              <div className="prompt-tabs">
                <button
                  className={`prompt-tab${promptTab === 'positive' ? ' active' : ''}`}
                  onClick={() => setPromptTab('positive')}
                >正向提示词</button>
                <button
                  className={`prompt-tab${promptTab === 'negative' ? ' active' : ''}`}
                  onClick={() => setPromptTab('negative')}
                >负向提示词</button>
              </div>
              <div className="prompt-text-wrap">
                <pre className="prompt-text">
                  {promptTab === 'positive' ? selected.positivePrompt : selected.negativePrompt}
                </pre>
              </div>
              <button
                className="prompt-copy-btn"
                onClick={() => navigator.clipboard.writeText(
                  promptTab === 'positive' ? selected.positivePrompt : selected.negativePrompt
                )}
              >复制提示词</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
