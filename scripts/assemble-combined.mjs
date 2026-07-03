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
// 拦截 WORK SHOWCASE 按钮（页面可能被 Google 翻译改写文字，故用类名 a.send 匹配，
// 不依赖英文文字）。三重保险：
//  B) 点击/按下落在 a.send 圆圈范围内 → 抢先跳转
//  C) 兜底：若刚在按钮上按下、随后发生 history.pushState 客户端导航 → 重定向
// 附 [SC] 控制台日志便于诊断。
// 点 SHOWCASE 不跳走，而是在外壳上盖一个全屏 iframe 浮层加载作品集；外壳原地不动。
// 作品集里点“返回”→ postMessage('sc-close') → 移除浮层 → 秒回 showcase。彻底避开
// Noomo 的 contact 渲染 / bfcache / 重播 START 等所有问题。
const FORCE_NAV = [
  "<script>(function(){",
  "var open=false,TARGET='/work/works/';",
  "function log(){try{console.log.apply(console,['[SC]'].concat([].slice.call(arguments)));}catch(e){}}",
  "function scEl(){var a=document.querySelector('a.send');if(a)return a.querySelector('.circle')||a;return null;}",
  "function inSC(x,y){var el=scEl();if(!el||x==null)return false;var r=el.getBoundingClientRect();if(r.width<2||r.height<2)return false;return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;}",
  "function openP(){if(open||document.getElementById('__scf'))return;open=true;var f=document.createElement('iframe');f.id='__scf';f.src=TARGET;f.setAttribute('allow','autoplay; clipboard-write');f.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;border:0;margin:0;z-index:2147483647;background:#eef3fd;';(document.body||document.documentElement).appendChild(f);document.documentElement.style.overflow='hidden';if(document.body)document.body.style.overflow='hidden';log('portfolio iframe opened');}",
  "function closeP(){var f=document.getElementById('__scf');if(f)f.remove();document.documentElement.style.overflow='';if(document.body)document.body.style.overflow='';open=false;log('portfolio closed');}",
  "window.addEventListener('message',function(e){if(e&&e.data==='sc-close')closeP();},false);",
  "function block(e){var a=(e.target&&e.target.closest)?e.target.closest('a.send'):null;if(!a&&e.clientX!=null&&inSC(e.clientX,e.clientY))a=scEl();if(!a)return;if(e.preventDefault)e.preventDefault();if(e.stopImmediatePropagation)e.stopImmediatePropagation();if(e.stopPropagation)e.stopPropagation();log('showcase hit @'+e.type+' -> open overlay');openP();}",
  "['pointerdown','mousedown','pointerup','mouseup','click','auxclick'].forEach(function(t){window.addEventListener(t,block,true);document.addEventListener(t,block,true);});",
  "log('interceptor active v5 (iframe overlay)');",
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
