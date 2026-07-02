import Link from "next/link";
import { workSeries } from "@/data/works-data";

// 只展示已有图片的系列（跳过空系列如 forest / cherry）
const series = workSeries.filter((s) => s.images.length > 0);
const total = String(series.length).padStart(2, "0");

export default function WorksPage() {
  return (
    <main className="showcase">
      <div className="showcase-inner">
        {/* top bar */}
        <div className="sc-topbar">
          <span><span className="dot">●</span> XINGYAKAI — AI VISUAL WORK</span>
          <span>{total} SERIES</span>
        </div>

        {/* hero */}
        <header className="sc-hero">
          <p className="sc-kicker">Selected Work / 精选作品</p>
          <h1 className="sc-title">
            WORK<br />SHOW<em>CASE</em>
          </h1>
          <p className="sc-lead">
            AI 创作与视觉设计的实践探索 —— 每一个系列都是技术与美学的融合，附完整中英双语提示词。
          </p>
        </header>

        {/* grid */}
        <section className="sc-grid">
          {series.map((s, i) => (
            <Link key={s.slug} href={`/works/${s.slug}`} className="sc-card">
              <div className="sc-card-media">
                <span className="sc-card-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="sc-card-go">↗</span>
                <img src={s.coverImg} alt={s.title} loading="lazy" />
              </div>
              <div className="sc-card-foot">
                <h2 className="sc-card-name">{s.title}</h2>
                <span className="sc-card-tag">{s.tag}</span>
              </div>
              <p className="sc-card-desc">{s.description}</p>
            </Link>
          ))}
        </section>

        {/* footer */}
        <footer className="sc-foot">
          <span>© {new Date().getFullYear()} XINGYAKAI</span>
          <span>{series.reduce((n, s) => n + s.images.length, 0)} WORKS · SCROLL TO EXPLORE</span>
        </footer>
      </div>
    </main>
  );
}
