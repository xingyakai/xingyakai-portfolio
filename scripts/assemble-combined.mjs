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
// 双保险拦截 WORK SHOWCASE：
//  A) 记录最后指针坐标（即使被覆盖层吞，pointer 事件仍先经 window 捕获到达这里）
//  B) 直接命中：点击坐标落在 SHOWCASE 圆圈内 → 抢先跳转
//  C) 兜底：monkey-patch history.pushState/replaceState —— 只要发生客户端导航、
//     且最后指针在圆圈内，就重定向到作品集（无需知道目标路径）
// 附 [SC] 控制台日志，便于线上诊断。
const FORCE_NAV = [
  "<script>(function(){",
  "var lx=-1,ly=-1,done=false;var TARGET='/work/works/';",
  "function log(){try{console.log.apply(console,['[SC]'].concat([].slice.call(arguments)));}catch(e){}}",
  "function scRect(){var q=document.querySelectorAll('.circle,.inner-circle,a.send');",
  "for(var i=0;i<q.length;i++){if(/WORK\\s*SHOWCASE/i.test((q[i].textContent||'').replace(/\\s+/g,' '))){var r=q[i].getBoundingClientRect();if(r.width>2&&r.height>2)return r;}}return null;}",
  "function inSC(){var r=scRect();if(!r)return false;return lx>=r.left&&lx<=r.right&&ly>=r.top&&ly<=r.bottom;}",
  "function goPortfolio(why){if(done)return;done=true;log('redirect via',why);window.location.href=TARGET;}",
  "function rec(e){if(e&&e.clientX!=null){lx=e.clientX;ly=e.clientY;}}",
  "function hit(e){rec(e);if(done)return;if(inSC()){if(e&&e.preventDefault)e.preventDefault();if(e&&e.stopImmediatePropagation)e.stopImmediatePropagation();if(e&&e.stopPropagation)e.stopPropagation();goPortfolio('click@'+e.type);}}",
  "['pointermove','mousemove','pointerover'].forEach(function(t){window.addEventListener(t,rec,true);document.addEventListener(t,rec,true);});",
  "['pointerdown','mousedown','pointerup','mouseup','click'].forEach(function(t){window.addEventListener(t,hit,true);document.addEventListener(t,hit,true);});",
  "function wrap(name){var o=history[name];if(!o||o.__scw)return;var f=function(s,t,u){if(!done&&inSC()){goPortfolio(name+' '+u);return;}return o.apply(this,arguments);};f.__scw=1;history[name]=f;}",
  "wrap('pushState');wrap('replaceState');",
  "log('interceptor active');",
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
