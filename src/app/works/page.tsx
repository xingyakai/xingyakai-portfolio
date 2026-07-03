'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { workSeries } from "@/data/works-data";
import { asset } from "@/lib/asset";

// 只展示已有图片的系列（跳过空系列如 forest / cherry）
const series = workSeries.filter((s) => s.images.length > 0);
const total = String(series.length).padStart(2, "0");
const totalWorks = series.reduce((n, s) => n + s.images.length, 0);

export default function WorksPage() {
  const router = useRouter();
  const rootRef = useRef<HTMLElement>(null);
  const [exiting, setExiting] = useState(false);

  // 首屏进场 + 滚动进场：进入视口即 .in
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>(".sc-reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, root }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // 点击转场：藏青色板扫上来 → 再跳转
  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (exiting) return;
    setExiting(true);
    setTimeout(() => router.push(href), 950);
  };

  // 返回 noomoagency 外壳首页（站根，绕过 basePath 的硬跳转）
  const backToShell = () => {
    window.location.href = "/";
  };

  return (
    <main className="showcase" ref={rootRef}>
      <div className={`sc-transition${exiting ? " active" : ""}`}>
        <span>Entering</span>
      </div>

      <div className="showcase-inner">
        {/* top bar */}
        <div className="sc-topbar sc-reveal">
          <span className="sc-topbar-left">
            <button className="sc-back" onClick={backToShell}>
              <span className="sc-back-arrow">←</span> 返回主站
            </button>
            <span className="sc-brand"><span className="dot">●</span> XINGYAKAI — AI VISUAL WORK</span>
          </span>
          <span>{total} SERIES</span>
        </div>

        {/* hero */}
        <header className="sc-hero">
          <p className="sc-kicker sc-reveal" style={{ transitionDelay: "0.1s" }}>Selected Work / 精选作品</p>
          <h1 className="sc-title sc-reveal">
            <span className="sc-line"><span>WORK</span></span>
            <span className="sc-line"><span>SHOW<em>CASE</em></span></span>
          </h1>
          <p className="sc-lead sc-reveal" style={{ transitionDelay: "0.5s" }}>
            AI 创作与视觉设计的实践探索 —— 每一个系列都是技术与美学的融合，附完整中英双语提示词。
          </p>
        </header>

        {/* grid */}
        <section className="sc-grid">
          {series.map((s, i) => (
            <a
              key={s.slug}
              href={`/works/${s.slug}`}
              onClick={go(`/works/${s.slug}`)}
              className="sc-card sc-reveal"
              style={{ transitionDelay: `${(i % 3) * 0.13}s` }}
            >
              <div className="sc-card-media">
                <span className="sc-card-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="sc-card-go">↗</span>
                <img src={asset(s.coverImg)} alt={s.title} loading="lazy" />
              </div>
              <div className="sc-card-foot">
                <h2 className="sc-card-name">{s.title}</h2>
                <span className="sc-card-tag">{s.tag}</span>
              </div>
              <p className="sc-card-desc">{s.description}</p>
            </a>
          ))}
        </section>

        {/* footer */}
        <footer className="sc-foot sc-reveal">
          <span>© {new Date().getFullYear()} XINGYAKAI</span>
          <span>{totalWorks} WORKS · SCROLL TO EXPLORE</span>
        </footer>
      </div>
    </main>
  );
}
