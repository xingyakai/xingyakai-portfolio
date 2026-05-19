import Link from "next/link";
import { posts } from "@/data/content";

const tagColors: Record<string, string> = {
  "AI创作": "bg-violet-50 text-violet-600",
  "设计":   "bg-blue-50 text-blue-600",
  "思考":   "bg-amber-50 text-amber-600",
  "工具":   "bg-emerald-50 text-emerald-600",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-8 max-w-5xl mx-auto">
      <div className="mb-16">
        <p className="text-xs tracking-widest text-neutral-400 uppercase mb-4">Blog</p>
        <h1 className="text-6xl font-black mb-6">文章</h1>
        <p className="text-neutral-500 text-lg">分享 AI 创作技巧、设计方法与行业思考。</p>
      </div>
      <div className="space-y-6">
        {posts.map((post, i) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card group flex items-start gap-8 block">
            <div className="hidden md:block text-5xl font-black text-neutral-100 w-16 flex-shrink-0 pt-1">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`tag ${tagColors[post.tag] ?? "bg-neutral-100 text-neutral-500"}`}>{post.tag}</span>
                <span className="text-xs text-neutral-400">{post.date} · {post.readTime}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-neutral-500 transition-colors">{post.title}</h2>
              <p className="text-neutral-400 text-sm leading-relaxed">{post.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
