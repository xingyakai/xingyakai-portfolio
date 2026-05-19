'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { workSeries, WorkImage } from '@/data/works-data';

export default function WorkDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const slug    = params?.slug as string;
  const series  = workSeries.find(w => w.slug === slug);

  const [selected, setSelected] = useState<WorkImage | null>(null);
  const [promptTab, setPromptTab] = useState<'positive' | 'negative'>('positive');
  const [modalVisible, setModalVisible] = useState(false);

  // Enable vertical scroll on detail pages
  useEffect(() => {
    document.documentElement.classList.add('detail-page');
    return () => document.documentElement.classList.remove('detail-page');
  }, []);

  // Open modal
  const openModal = (img: WorkImage) => {
    setSelected(img);
    setPromptTab('positive');
    setModalVisible(false);
    // Tiny delay so enter animation fires
    requestAnimationFrame(() => requestAnimationFrame(() => setModalVisible(true)));
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelected(null), 400);
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!series) {
    return (
      <div className="work-detail-empty">
        <p>系列不存在</p>
        <button onClick={() => router.push('/')}>← 返回首页</button>
      </div>
    );
  }

  return (
    <>
      {/* ── Page ── */}
      <div className="work-detail-page">

        {/* Header */}
        <header className="work-detail-header">
          <button className="work-detail-back" onClick={() => router.push('/')}>
            ← Back
          </button>
          <div className="work-detail-meta">
            <span className="work-detail-tag">{series.tag}</span>
            <h1 className="work-detail-title">{series.title}</h1>
            <p className="work-detail-desc">{series.description}</p>
          </div>
          <span className="work-detail-count">
            {String(series.images.length).padStart(2,'0')} 作品
          </span>
        </header>

        {/* Image grid */}
        {series.images.length === 0 ? (
          <div className="work-detail-placeholder">
            <p>该系列暂无作品</p>
          </div>
        ) : (
          <div className="work-detail-grid">
            {series.images.map((img, i) => (
              <div
                key={i}
                className="work-detail-card"
                onClick={() => openModal(img)}
              >
                <img src={img.src} alt={`${series.title} ${i + 1}`} className="work-detail-img" />
                <div className="work-detail-card-overlay">
                  <span className="work-detail-card-hint">查看提示词 →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
            {/* Modal image */}
            <div className="prompt-modal-img-wrap">
              <img src={selected.src} alt="" className="prompt-modal-img" />
            </div>

            {/* Modal content */}
            <div className="prompt-modal-content">
              <div className="prompt-modal-top">
                <h2 className="prompt-modal-title">{series.title}</h2>
                <button className="prompt-modal-close" onClick={closeModal}>✕</button>
              </div>

              {/* Tabs */}
              <div className="prompt-tabs">
                <button
                  className={`prompt-tab${promptTab === 'positive' ? ' active' : ''}`}
                  onClick={() => setPromptTab('positive')}
                >
                  正向提示词
                </button>
                <button
                  className={`prompt-tab${promptTab === 'negative' ? ' active' : ''}`}
                  onClick={() => setPromptTab('negative')}
                >
                  负向提示词
                </button>
              </div>

              {/* Prompt text */}
              <div className="prompt-text-wrap">
                <pre className="prompt-text">
                  {promptTab === 'positive' ? selected.positivePrompt : selected.negativePrompt}
                </pre>
              </div>

              {/* Copy button */}
              <button
                className="prompt-copy-btn"
                onClick={() => {
                  const text = promptTab === 'positive'
                    ? selected.positivePrompt
                    : selected.negativePrompt;
                  navigator.clipboard.writeText(text);
                }}
              >
                复制提示词
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
