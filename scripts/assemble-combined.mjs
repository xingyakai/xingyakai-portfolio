// 组合站组装脚本：
//  1. 把 next 静态导出 out/* 整体挪进 out/work/（作品集自包含在 /work）
//  2. 把 noomoagency 外壳 shell/*（除 shell/work）铺到 out/ 根
//  3. 把外壳首页 SHOWCASE 按钮的 href="/work" 改成 /work/works/（直达作品集列表）
// 只在设置了 NEXT_PUBLIC_BASE_PATH 时运行（组合站构建）。
import {
  cpSync, mkdirSync, readdirSync, renameSync, rmSync,
  existsSync, readFileSync, writeFileSync,
} from "node:fs";
import { join } from "node:path";

if (!process.env.NEXT_PUBLIC_BASE_PATH) {
  console.log("[assemble] NEXT_PUBLIC_BASE_PATH 未设置，跳过组合（标准构建）。");
  process.exit(0);
}

const OUT = "out";
const SHELL = "shell";

if (!existsSync(SHELL)) {
  console.error(`[assemble] 缺少 ${SHELL}/ 目录（noomoagency 外壳），无法组装。`);
  process.exit(1);
}

// 1) out/* → out/work/
const staging = "out__staging";
rmSync(staging, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });
for (const entry of readdirSync(OUT)) {
  renameSync(join(OUT, entry), join(staging, entry));
}
renameSync(staging, join(OUT, "work"));

// 2) shell/* (except its own /work) → out/ root
for (const entry of readdirSync(SHELL)) {
  if (entry === "work") continue;
  cpSync(join(SHELL, entry), join(OUT, entry), { recursive: true });
}

// 3) patch SHOWCASE href in the shell homepage + force a hard navigation
//    (Nuxt SPA would otherwise client-route /work/works/ into its own 404;
//     a capture-phase handler beats Nuxt's click handler and does a real load)
const FORCE_NAV = `<script>document.addEventListener("click",function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href*="/work/works"]');if(a){e.preventDefault();e.stopPropagation();window.location.href="/work/works/";}},true);</script>`;
const indexPath = join(OUT, "index.html");
if (existsSync(indexPath)) {
  let html = readFileSync(indexPath, "utf8");
  const before = html;
  html = html.replaceAll('href="/work"', 'href="/work/works/"');
  if (!html.includes("/work/works")) {
    console.warn('[assemble] 警告：未在 index.html 找到 href="/work"，SHOWCASE 未改。');
  }
  html = html.replace("</body>", `${FORCE_NAV}</body>`);
  if (html !== before) {
    writeFileSync(indexPath, html);
    console.log("[assemble] SHOWCASE href → /work/works/ (+ 强制硬跳转脚本)");
  }
}

console.log("[assemble] 组合完成：外壳在根，作品集在 /work。");
