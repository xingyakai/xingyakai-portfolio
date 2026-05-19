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
  const router          = useRouter();
  const trackRef        = useRef<HTMLDivElement>(null);
  const currentRef      = useRef(0);
  const targetRef       = useRef(0);
  const singleWidthRef  = useRef(0);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const counterRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf: number;
    let initialized = false;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    track.querySelectorAll<HTMLElement>('.work-item').forEach(item => {
      item.addEventListener('mouseenter', () => item.classList.add('is-hovered'));
      item.addEventListener('mouseleave', () => item.classList.remove('is-hovered'));
    });

    const tick = () => {
      // ── Init: measure sw using .hero-panel offsetLeft difference ──
      // Track = [hero, w1-5, hero, w1-5, hero, w1-5]
      // sw = distance between first and second hero panel
      if (!initialized) {
        const heroes = track.querySelectorAll<HTMLElement>('.hero-panel');
        if (heroes.length >= 2) {
          const sw = heroes[1].offsetLeft - heroes[0].offsetLeft;
          if (sw > 0) {
            singleWidthRef.current = sw;
            currentRef.current = sw;  // start at middle copy
            targetRef.current  = sw;
            initialized = true;
          }
        }
      }

      currentRef.current = lerp(currentRef.current, targetRef.current, 0.08);

      // ── Seamless infinite loop ──────────────────────────────────
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
      const items   = track.querySelectorAll<HTMLElement>('.work-item');
      let closestIdx = 0, closestDist = Infinity;

      items.forEach((item, i) => {
        const rect       = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const distance   = Math.abs(itemCenter - vCenter);
        const maxDist    = window.innerWidth * 0.85;
        const progress   = Math.max(0, 1 - distance / maxDist);

        const baseScale   = 0.72 + progress * 0.28;
        const isHovered   = item.classList.contains('is-hovered');
        const targetScale = isHovered ? baseScale + 0.07 : baseScale;
        const prevScale   = item.dataset.scale ? parseFloat(item.dataset.scale) : baseScale;
        const newScale    = lerp(prevScale, targetScale, 0.1);
        item.dataset.scale = String(newScale);
        item.style.transform = `scale(${newScale})`;

        const img = item.querySelector<HTMLElement>('.work-item-img');
        if (img) {
          const targetB  = isHovered ? 1.0 : (0.35 + progress * 0.45);
          const m        = img.style.filter.match(/brightness\(([^)]+)\)/);
          const currentB = m ? parseFloat(m[1]) : 0.35;
          img.style.filter = `brightness(${lerp(currentB, targetB, 0.12)})`;
        }

        if (distance < closestDist) { closestDist = distance; closestIdx = i; }
      });

      items.forEach((item, i) => item.classList.toggle('is-centered', i === closestIdx));

      if (progressFillRef.current && sw > 0) {
        const posInSet = ((currentRef.current % sw) + sw) % sw;
        progressFillRef.current.style.width = `${(posInSet / sw) * 100}%`;
      }
      if (counterRef.current) {
        const realIdx = closestIdx % WORKS.length;
        counterRef.current.textContent =
          `${String(realIdx + 1).padStart(2,'0')} / ${String(WORKS.length).padStart(2,'0')}`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetRef.current += e.deltaY + e.deltaX;
    };
    window.addEventListener('wheel', onWheel, { passive: false });

    const onKeyDown = (e: KeyboardEvent) => {
      const step = 420;
      if (e.key === 'ArrowRight') targetRef.current += step;
      if (e.key === 'ArrowLeft')  targetRef.current -= step;
    };
    window.addEventListener('keydown', onKeyDown);

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
  }, []);

  // Render [hero + works] × 3 for seamless loop
  const copies = [0, 1, 2];

  return (
    <>
      <div className={`loader${loaded ? ' hidden' : ''}`}>
        <div className="loader-logo"><span>FORGE ETERNITY</span></div>
      </div>

      <section className="h-scroll-section" id="work">
        <div ref={trackRef} className="h-scroll-track">
          {copies.map(copyIdx => (
            <div key={copyIdx} style={{ display: 'contents' }}>

              {/* Hero panel */}
              <div className="hero-panel">
                <h1 className="hero-title">
                  <span className="hero-title-line">
                    <span style={copyIdx === 0 ? undefined : { transform: 'none', animation: 'none' }}>FORGE</span>
                  </span>
                  <span className="hero-title-line">
                    <span style={copyIdx === 0 ? undefined : { transform: 'none', animation: 'none' }}>ETERNITY</span>
                  </span>
                </h1>
                <p className="hero-tagline" style={copyIdx === 0 ? undefined : { opacity: 0.5, animation: 'none' }}>
                  <span>
                    X 是无限可能，Y 是内心坐标，K 是永恒印记。<br />
                    我是邢亚凯，在有限里创造无限。
                  </span>
                </p>
              </div>

              {/* Work items */}
              {WORKS.map((w, wi) => {
                const isLast = wi === WORKS.length - 1;
                return (
                  <article
                    key={`${copyIdx}-${w.id}`}
                    className={`work-item work-item--${w.id}`}
                    style={{ cursor: 'none', ...(isLast ? { marginRight: '5vw' } : {}) }}
                    onClick={() => router.push(`/works/${w.slug}`)}
                  >
                    <img src={w.img} alt={w.title} className="work-item-img" loading="lazy" />
                    <div className="work-item-content">
                      <div className="work-item-tag">
                        <span className="work-dot" />
                        {w.tag}
                      </div>
                      <h2 className="work-item-title">{w.title}</h2>
                    </div>
                  </article>
                );
              })}
            </div>
          ))}
        </div>

        <div className="gallery-progress">
          <div ref={progressFillRef} className="gallery-progress-fill" />
        </div>
        <div ref={counterRef} className="gallery-counter">01 / 05</div>
      </section>

      <section className="about-section" id="about">
        <div>
          <p className="about-label">About</p>
          <h2 className="about-big">在有限里<br />创造无限</h2>
        </div>
        <div>
          <p className="about-body">
            我是邢亚凯（YXK）。X 是无限可能，Y 是内心坐标，K 是永恒印记。
            我用图像、色彩与光影探索人类情感的边界，
            在数字世界里留下那些无法被时间磨灭的痕迹。
          </p>
          <a href="mailto:yakaixing626@gmail.com" className="about-cta">Get in touch →</a>
        </div>
        <footer className="footer" style={{ position:'absolute', bottom:0, left:0, right:0 }}>
          <span>© 2026 邢亚凯 · YXK</span>
          <span>Forge Eternity</span>
        </footer>
      </section>
    </>
  );
}
