'use client';
import { useState, useEffect } from 'react';
import { asset } from '@/lib/asset';

export default function IntroOverlay() {
  const [visible, setVisible] = useState(true);

  // Lock body scroll while overlay is visible
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      onWheel={(e) => e.preventDefault()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        cursor: 'pointer',
      }}
    >
      <video
        src={asset("/intro.mp4")}
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </div>
  );
}
