import { works } from "@/data/content";

const allCategories = ["全部", ...Array.from(new Set(works.map((w) => w.category)))];

export default function WorksPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-8 max-w-6xl mx-auto">
      <div className="mb-16">
        <p className="text-xs tracking-widest text-neutral-400 uppercase mb-4">Portfolio</p>
        <h1 className="text-6xl font-black mb-6">作品集</h1>
        <p className="text-neutral-500 text-lg max-w-xl">
          AI 创作与视觉设计的实践探索，每一件作品都是技术与美学的融合。
        </p>
      </div>
      <div className="flex gap-3 mb-12 flex-wrap">
        {allCategories.map((cat) => (
          <button key={cat} className="px-5 py-2 rounded-full text-sm font-medium border border-neutral-200 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 transition-all">
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((work) => (
          <div key={work.title} className="group cursor-pointer">
            <div className={`w-full h-64 rounded-2xl overflow-hidden mb-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl`}>
              {work.image ? (
                <img src={work.image} alt={work.title} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${work.color}`} />
              )}
            </div>
            <h3 className="font-semibold text-lg mb-1">{work.title}</h3>
            <p className="text-sm text-neutral-400">{work.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
