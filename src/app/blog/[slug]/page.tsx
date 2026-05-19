import Link from "next/link";
import { posts } from "@/data/content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen pt-24 pb-20 px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors mb-12 inline-flex items-center gap-2">
          ← 返回博客
        </Link>
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="tag">{post.tag}</span>
            <span className="text-xs text-neutral-400">{post.date} · {post.readTime}</span>
          </div>
          <h1 className="text-4xl font-black leading-tight mb-4">{post.title}</h1>
          <p className="text-neutral-500 text-lg leading-relaxed mb-12">{post.desc}</p>
        </div>
        <div className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
        <div className="mt-16 pt-10 border-t border-neutral-100 flex justify-between">
          <Link href="/blog" className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors">← 返回博客列表</Link>
          <Link href="/works" className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors">查看作品集 →</Link>
        </div>
      </div>
    </div>
  );
}
