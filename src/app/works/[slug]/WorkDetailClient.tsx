'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { workSeries, WorkImage } from '@/data/works-data';

export default function WorkDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const slug    = params?.slug as string;
  const series  = workSeries.find(w => w.slug === slug);

  const [selected, setSelected]         = useState<WorkImage | null>(null);
  const [promptTab, setPromptTab]       = useState<'positive' | 'negative'>('positive');
  const [modalVisible, setModalVisible] = useState(false);

  const trackRef        = useRef<HTMLDivElement>(null);
  const currentRef      = useRef(0);
  const targetRef       = useRef(0);
  const singleWidthRef  = useRef(0);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const counterRef      = useRef<HTMLDivElement>(null);

  // Render images 3× for seamless infinite loop
  const tripleImages = series && series.images.length > 0
    ? [...series.images, ...series.images, ...series.images]
    : [];

  // ── Scroll engine with infinite loop ────────────────────────
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !series || series.images.length === 0) return;

    let raf: number;
    let initialized = false;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

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

  const goBack = () => {
    // 返回上一页；若无站内历史（如直接打开链接）则回作品集列表
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/works');
    }
  };

  return (
    <div className="work-detail">
      {/* ── 悬浮返回按钮（始终可见） ── */}
      <button className="detail-back-btn" onClick={goBack}>
        <span className="back-arrow">←</span> 返回
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
              <img src={img.src} alt={img.title} className="detail-item-img" />
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
            onClick={() => router.push('/')}
          >
            ← 返回首页
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
              <img src={selected.src} alt={selected.title} className="prompt-modal-img" />
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
