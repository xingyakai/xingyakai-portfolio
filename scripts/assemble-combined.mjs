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

// 3) 把「WORK SHOWCASE」圆形按钮劫持到 /work/works/。
//    该按钮实际包在 <a href="/contact" class="send"> 里（不是 /work 链接），
//    且由 Nuxt SPA 接管点击 —— 按“钮内文字”匹配、capture 阶段抢先拦截 + 强制硬跳转。
// Noomo 用 #smooth-wrapper 平滑滚动 + 自定义指针系统，点击可能被覆盖层/canvas 吞掉，
// 且导航走 Nuxt 客户端路由。所以用「坐标命中检测」：只要指针落在 WORK SHOWCASE 圆圈
// 的屏幕范围内，就在 window+document 捕获阶段抢先跳转（多事件兜底 + 目标匹配兜底）。
const FORCE_NAV = [
  "<script>(function(){var done=false;",
  "function scEl(){var q=document.querySelectorAll('.circle,.inner-circle,a.send,a');",
  "for(var i=0;i<q.length;i++){if(/WORK\\s*SHOWCASE/i.test((q[i].textContent||'').replace(/\\s+/g,' ')))return q[i];}return null;}",
  "function fire(e){done=true;if(e&&e.preventDefault)e.preventDefault();if(e&&e.stopImmediatePropagation)e.stopImmediatePropagation();if(e&&e.stopPropagation)e.stopPropagation();window.location.href='/work/works/';}",
  "function h(e){if(done)return;var el=scEl();if(!el)return;",
  "var t=e.target;if(t&&t.closest&&(t.closest('a.send')||t.closest('.circle'))){var m=t.closest('a.send')||t.closest('.circle');if(/WORK\\s*SHOWCASE/i.test((m.textContent||'').replace(/\\s+/g,' ')))return fire(e);}",
  "var r=el.getBoundingClientRect();if(r.width<2||r.height<2)return;",
  "var x=e.clientX,y=e.clientY;if(x==null)return;",
  "if(x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom)return fire(e);}",
  "['pointerdown','mousedown','pointerup','mouseup','click'].forEach(function(t){",
  "document.addEventListener(t,h,true);window.addEventListener(t,h,true);});",
  "})();</script>",
].join("");
const indexPath = join(OUT, "index.html");
if (existsSync(indexPath)) {
  let html = readFileSync(indexPath, "utf8");
  if (!/WORK<br>\s*SHOWCASE|WORK\s*SHOWCASE/i.test(html)) {
    console.warn("[assemble] 警告：未在 index.html 找到 WORK SHOWCASE 按钮文字。");
  }
  html = html.replace("</body>", `${FORCE_NAV}</body>`);
  writeFileSync(indexPath, html);
  console.log("[assemble] 注入 SHOWCASE 按钮劫持脚本 → /work/works/");
}

console.log("[assemble] 组合完成：外壳在根，作品集在 /work。");
