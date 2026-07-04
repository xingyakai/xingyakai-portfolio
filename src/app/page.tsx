'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 旧首页（FORGE ETERNITY）已废弃：任何访问 / 的都直接重定向到作品集 showcase。
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/works');
  }, [router]);
  return null;
}
