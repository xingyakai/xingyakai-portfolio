'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { workSeries, WorkImage } from '@/data/works-data';

export default function WorkDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const slug    = params?.slug as string;
  const series  = workSeries.find(w => w.slug === slug);

  const [selected, setSelected]     = useState<WorkImage | null>(null);
  const [promptTab, setPromptTab]   = useState<'positive' | 'negative'>('positive');
  const [modalVisible, setModalVisible] = useState(false);

  const trackRef        = useRef<HTMLDivElement>(null);
  const currentRef      = useRef(0);
  const targetRef       = useRef(0);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const counterRef      = useRef<HTMLDivElement>(null);

  // ── Horizontal scroll engine (same as homepage) ──────────────
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !series) return;

    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    track.querySelectorAll<HTMLElement>('.detail-item').forEach(item => {
      item.addEventListener('mouseenter', () => item.classList.add('is-hovered'));
      item.addEventListener('mouseleave', () => item.classList.remove('is-hovered'));
    });

    const tick = () => {
      currentRef.current = lerp(currentRef.current, targetRef.current, 0.08);
      const max = track.scrollWidth - window.innerWidth;
      currentRef.current = Math.max(0, Math.min(currentRef.current, max));
      track.style.transform = `translateX(${-currentRef.current}px)`;

      const vCenter = window.innerWidth / 2;
      const items   = track.querySelectorAll<HTMLElement>('.detail-item');
      let closestIdx = 0, closestDist = Infinity;

      items.forEach((item, i) => {
        const rect       = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const distance   = Math.abs(itemCenter - vCenter);
        const maxDist    = window.innerWidth * 0.85;
        const progress   = Math.max(0, 1 - distance / maxDist);

        // Scale + hover boost
        const baseScale   = 0.72 + progress * 0.28;
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

      if (progressFillRef.current && max > 0) {
        progressFillRef.current.style.width = `${(currentRef.current / max) * 100}%`;
      }
      if (counterRef.current) {
        const n     = String(closestIdx + 1).padStart(2, '0');
        const total = String(series.images.length).padStart(2, '0');
        counterRef.current.textContent = `${n} / ${total}`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY + e.deltaX;
      const max   = track.scrollWidth - window.innerWidth;
      targetRef.current = Math.max(0, Math.min(targetRef.current + delta, max));
    };
    window.addEventListener('wheel', onWheel, { passive: false });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeModal(); return; }
      const step = 420;
      if (e.key === 'ArrowRight') targetRef.current += step;
      if (e.key === 'ArrowLeft')  targetRef.current -= step;
      const max = track.scrollWidth - window.innerWidth;
      targetRef.current = Math.max(0, Math.min(targetRef.current, max));
    };
    window.addEventListener('keydown', onKeyDown);

    let isDragging = false, dragStartX = 0, dragStartTarget = 0;
    const onMouseDown = (e: MouseEvent) => { isDragging = true; dragStartX = e.clientX; dragStartTarget = targetRef.current; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const max = track.scrollWidth - window.innerWidth;
      targetRef.current = Math.max(0, Math.min(dragStartTarget + (dragStartX - e.clientX) * 1.8, max));
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

  return (
    <>
      {/* ── Gallery ── */}
      <section className="h-scroll-section">
        <div ref={trackRef} className="h-scroll-track">
          {series.images.length === 0 ? (
            <div className="detail-empty">该系列暂无作品</div>
          ) : (
            series.images.map((img, i) => (
              <div
                key={i}
                className={`detail-item detail-item--${(i % 5) + 1}`}
                onClick={() => openModal(img)}
                style={{ cursor: 'none' }}
              >
                <img src={img.src} alt={`${series.title} ${i + 1}`} className="detail-item-img" />
                <div className="work-item-content">
                  <div className="work-item-tag">
                    <span className="work-dot" />
                    {series.tag}
                  </div>
                  <h2 className="work-item-title">{series.title} {String(i + 1).padStart(2,'0')}</h2>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="gallery-progress">
          <div ref={progressFillRef} className="gallery-progress-fill" />
        </div>
        <div ref={counterRef} className="gallery-counter">
          {series.images.length > 0 ? `01 / ${String(series.images.length).padStart(2,'0')}` : ''}
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
          <button className="about-cta" style={{ background:'none', border:'none', fontFamily:'inherit', cursor:'none' }} onClick={() => router.push('/')}>
            ← 返回首页
          </button>
        </div>
        <footer className="footer" style={{ position:'absolute', bottom:0, left:0, right:0 }}>
          <span>点击图片查看提示词</span>
          <span>{series.images.length} 作品</span>
        </footer>
      </section>

      {/* ── Prompt Modal ── */}
      {selected && (
        <div className={`prompt-modal-backdrop${modalVisible ? ' visible' : ''}`} onClick={closeModal}>
          <div className={`prompt-modal${modalVisible ? ' visible' : ''}`} onClick={e => e.stopPropagation()}>
            <div className="prompt-modal-img-wrap">
              <img src={selected.src} alt="" className="prompt-modal-img" />
            </div>
            <div className="prompt-modal-content">
              <div className="prompt-modal-top">
                <h2 className="prompt-modal-title">{series.title}</h2>
                <button className="prompt-modal-close" onClick={closeModal}>✕</button>
              </div>
              <div className="prompt-tabs">
                <button className={`prompt-tab${promptTab === 'positive' ? ' active' : ''}`} onClick={() => setPromptTab('positive')}>正向提示词</button>
                <button className={`prompt-tab${promptTab === 'negative' ? ' active' : ''}`} onClick={() => setPromptTab('negative')}>负向提示词</button>
              </div>
              <div className="prompt-text-wrap">
                <pre className="prompt-text">{promptTab === 'positive' ? selected.positivePrompt : selected.negativePrompt}</pre>
              </div>
              <button className="prompt-copy-btn" onClick={() => navigator.clipboard.writeText(promptTab === 'positive' ? selected.positivePrompt : selected.negativePrompt)}>
                复制提示词
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
