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
const FORCE_NAV = [
  "<script>(function(){",
  "var done=false,pressT=0,TARGET='/work/works/';",
  "function log(){try{console.log.apply(console,['[SC]'].concat([].slice.call(arguments)));}catch(e){}}",
  "function scEl(){var a=document.querySelector('a.send');if(a)return a.querySelector('.circle')||a;return null;}",
  "function inSC(x,y){var el=scEl();if(!el||x==null)return false;var r=el.getBoundingClientRect();if(r.width<2||r.height<2)return false;return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;}",
  "function go(replace,why){if(done)return;done=true;log('redirect',why,replace?'(replace)':'(push)');if(replace)window.location.replace(TARGET);else window.location.href=TARGET;}",
  // 只记录“最近在按钮上按下/点了”，不拦事件、不阻止 Noomo 自己跳
  "function rec(e){if(e.clientX!=null&&inSC(e.clientX,e.clientY)){pressT=Date.now();log('press recorded @'+e.type);}}",
  "['pointerdown','mousedown','pointerup','click'].forEach(function(t){window.addEventListener(t,rec,true);document.addEventListener(t,rec,true);});",
  // 主机制：Noomo 客户端导航(pushState 到 /contact)后，若刚点过按钮，就用 replace 把这个历史项换成作品集 → 历史保持[首页,作品集]
  "function wrap(name){var o=history[name];if(!o||o.__scw)return;var f=function(s,t,u){var r=o.apply(this,arguments);if(!done&&Date.now()-pressT<2500){go(true,name+' '+u);}return r;};f.__scw=1;history[name]=f;}",
  "wrap('pushState');wrap('replaceState');",
  // 兜底：点了按钮但 Noomo 没走 pushState(比如整页跳)，400ms 后仍在原地就 push 过去(保留首页在历史里)
  "window.addEventListener('click',function(e){if(inSC(e.clientX,e.clientY)){var p=location.pathname;setTimeout(function(){if(!done&&location.pathname===p){go(false,'click-fallback');}},400);}},true);",
  "log('interceptor active v2 (replace-on-nav)');",
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
