'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const WORKS = [
  { id: 1, title: '琉璃之息',    tag: 'Digital Art', img: '/images/work-1.jpg', slug: 'liuli'   },
  { id: 2, title: '素颜诗',      tag: 'Portrait',    img: '/images/work-2.jpg', slug: 'suyan'   },
  { id: 3, title: '暖棕心事',    tag: 'Mood',        img: '/images/work-3.jpg', slug: 'nuanzon' },
  { id: 4, title: '油画里的夏日', tag: 'Painting',   img: '/images/work-4.jpg', slug: 'youhua'  },
  { id: 5, title: '旧梦',        tag: 'Cinematic',   img: '/images/work-5.jpg', slug: 'jiumeng' },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const router         = useRouter();
  const trackRef       = useRef<HTMLDivElement>(null);
  const currentRef     = useRef(0);
  const targetRef      = useRef(0);
  const hDoneRef       = useRef(false);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const counterRef     = useRef<HTMLDivElement>(null);

  // Loader
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1400);
    return () => clearTimeout(t);
  }, []);

  // Main scroll engine
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Hover listeners
    track.querySelectorAll<HTMLElement>('.work-item').forEach(item => {
      item.addEventListener('mouseenter', () => item.classList.add('is-hovered'));
      item.addEventListener('mouseleave', () => item.classList.remove('is-hovered'));
    });

    // ── RAF tick ──────────────────────────────────────────────
    const tick = () => {
      currentRef.current = lerp(currentRef.current, targetRef.current, 0.08);
      const max = track.scrollWidth - window.innerWidth;
      currentRef.current = Math.max(0, Math.min(currentRef.current, max));
      track.style.transform = `translateX(${-currentRef.current}px)`;

      const vCenter = window.innerWidth / 2;
      const items = track.querySelectorAll<HTMLElement>('.work-item');

      let closestIdx = 0;
      let closestDist = Infinity;

      items.forEach((item, i) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const distance = Math.abs(itemCenter - vCenter);
        const maxDist = window.innerWidth * 0.85;
        const progress = Math.max(0, 1 - distance / maxDist);

        // Scale card (+ hover boost, lerped for smooth in/out)
        const baseScale = 0.72 + progress * 0.28;
        const isHovered = item.classList.contains('is-hovered');
        const targetScale = isHovered ? baseScale + 0.07 : baseScale;
        const prevScale = item.dataset.scale ? parseFloat(item.dataset.scale) : baseScale;
        const newScale = lerp(prevScale, targetScale, 0.1);
        item.dataset.scale = String(newScale);
        item.style.transform = `scale(${newScale})`;

        // Smooth brightness (lerped, boosted on hover)
        const img = item.querySelector<HTMLElement>('.work-item-img');
        if (img) {
          const isHovered = item.classList.contains('is-hovered');
          const targetB = isHovered ? 1.0 : (0.35 + progress * 0.45);
          const m = img.style.filter.match(/brightness\(([^)]+)\)/);
          const currentB = m ? parseFloat(m[1]) : 0.35;
          img.style.filter = `brightness(${lerp(currentB, targetB, 0.12)})`;
        }

        // Track closest to center
        if (distance < closestDist) { closestDist = distance; closestIdx = i; }
      });

      // Glow border on centered item
      items.forEach((item, i) => {
        item.classList.toggle('is-centered', i === closestIdx);
      });

      // Progress bar
      if (progressFillRef.current && max > 0) {
        progressFillRef.current.style.width = `${(currentRef.current / max) * 100}%`;
      }

      // Counter  01 / 05
      if (counterRef.current) {
        const n = String(closestIdx + 1).padStart(2, '0');
        const total = String(WORKS.length).padStart(2, '0');
        counterRef.current.textContent = `${n} / ${total}`;
      }

      // Unlock scroll-back when at end
      hDoneRef.current = currentRef.current >= max - 1;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // ── Wheel ────────────────────────────────────────────────
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY + e.deltaX;
      if (!hDoneRef.current || delta < 0) {
        targetRef.current += delta;
        const max = track.scrollWidth - window.innerWidth;
        targetRef.current = Math.max(0, Math.min(targetRef.current, max));
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });

    // ── Keyboard arrows ──────────────────────────────────────
    const onKeyDown = (e: KeyboardEvent) => {
      const step = 420;
      if (e.key === 'ArrowRight') targetRef.current += step;
      if (e.key === 'ArrowLeft')  targetRef.current -= step;
      const max = track.scrollWidth - window.innerWidth;
      targetRef.current = Math.max(0, Math.min(targetRef.current, max));
    };
    window.addEventListener('keydown', onKeyDown);

    // ── Mouse drag ───────────────────────────────────────────
    let isDragging = false;
    let dragStartX = 0;
    let dragStartTarget = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartTarget = targetRef.current;
      track.style.cursor = 'grabbing';
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = dragStartX - e.clientX;
      const max = track.scrollWidth - window.innerWidth;
      targetRef.current = Math.max(0, Math.min(dragStartTarget + dx * 1.8, max));
    };
    const onMouseUp = () => {
      isDragging = false;
      track.style.cursor = '';
    };
    track.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // ── Touch / swipe ────────────────────────────────────────
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartX = e.touches[0].clientX; };
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault();
      const dx = touchStartX - e.touches[0].clientX;
      touchStartX = e.touches[0].clientX;
      const max = track.scrollWidth - window.innerWidth;
      targetRef.current = Math.max(0, Math.min(targetRef.current + dx * 1.5, max));
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
  }, []);

  return (
    <>
      {/* Loader */}
      <div className={`loader${loaded ? ' hidden' : ''}`}>
        <div className="loader-logo"><span>FORGE ETERNITY</span></div>
      </div>

      {/* ── Gallery section ── */}
      <section className="h-scroll-section" id="work">
        <div ref={trackRef} className="h-scroll-track">

          {/* Hero panel */}
          <div className="hero-panel">
            <h1 className="hero-title">
              <span className="hero-title-line"><span>FORGE</span></span>
              <span className="hero-title-line"><span>ETERNITY</span></span>
            </h1>
            <p className="hero-tagline">
              <span>
                X 是无限可能，Y 是内心坐标，K 是永恒印记。<br />
                我是邢亚凯，在有限里创造无限。
              </span>
            </p>
            <div className="hero-scroll-hint">Scroll →</div>
          </div>

          {/* Work items */}
          {WORKS.map((w) => (
            <article
              key={w.id}
              className={`work-item work-item--${w.id}`}
              onClick={() => router.push(`/works/${w.slug}`)}
              style={{ cursor: 'none' }}
            >
              <img src={w.img} alt={w.title} className="work-item-img" loading="lazy" />

              {/* Bottom label */}
              <div className="work-item-content">
                <div className="work-item-tag">
                  <span className="work-dot" />
                  {w.tag}
                </div>
                <h2 className="work-item-title">{w.title}</h2>
              </div>
            </article>
          ))}

        </div>

        {/* Progress bar */}
        <div className="gallery-progress">
          <div ref={progressFillRef} className="gallery-progress-fill" />
        </div>

        {/* Counter */}
        <div ref={counterRef} className="gallery-counter">01 / 05</div>
      </section>

      {/* ── About — always visible at bottom ── */}
      <section className="about-section" id="about">
        <div>
          <p className="about-label">About</p>
          <h2 className="about-big">
            在有限里<br />创造无限
          </h2>
        </div>
        <div>
          <p className="about-body">
            我是邢亚凯（YXK）。X 是无限可能，Y 是内心坐标，K 是永恒印记。
            我用图像、色彩与光影探索人类情感的边界，
            在数字世界里留下那些无法被时间磨灭的痕迹。
          </p>
          <a href="mailto:yakaixing626@gmail.com" className="about-cta">
            Get in touch →
          </a>
        </div>
        <footer className="footer" style={{ position:'absolute', bottom:0, left:0, right:0 }}>
          <span>© 2026 邢亚凯 · YXK</span>
          <span>Forge Eternity</span>
        </footer>
      </section>
    </>
  );
}
