// ============================================================
//  网站内容配置文件
//  所有文字、链接、作品、文章数据都在这里修改
//  不需要动其他任何文件
// ============================================================

// ---------- 基本信息 ----------
export const siteConfig = {
  name: "xingyakai",
  title: "xingyakai — AI创作者 & 设计师",
  description: "AI创作者与设计师的个人作品集和博客",
  email: "你的邮箱@example.com",
  github: "https://github.com/xingyakai",
};

// ---------- 首页 Hero ----------
export const hero = {
  name: "xingyakai",
  roles: ["AI 创作者", "视觉设计师"],   // 可以加减行
  ctaPrimary: { label: "查看作品", href: "/works" },
  ctaSecondary: { label: "阅读博客", href: "/blog" },
};

// ---------- 首页 关于我简介 ----------
export const aboutSnippet = {
  heading: "用 AI 重新定义\n创意边界",
  paragraphs: [
    "我是 xingyakai，一名专注于 AI 创作与视觉设计的独立创作者。擅长将 AI 工具与设计思维结合，创作出具有商业价值的视觉作品。",
    "同时通过博客分享 AI 创作技巧、设计方法论与行业洞察，帮助更多人掌握 AI 时代的创作工具。",
  ],
  stats: [
    { num: "50+", label: "完成项目" },
    { num: "3年",  label: "设计经验" },
    { num: "10K+", label: "内容读者" },
    { num: "∞",   label: "创作热情" },
  ],
};

// ---------- 导航菜单 ----------
export const navLinks = [
  { href: "/about", label: "关于我" },
  { href: "/works", label: "作品集" },
  { href: "/blog",  label: "博客"   },
];

// ---------- 作品集 ----------
export const works = [
  {
    title: "AI 视觉创作",
    category: "AI Art",
    desc: "用 Midjourney 生成的系列人像，应用于品牌推广",
    color: "from-violet-400 to-purple-600",
    image: "",   // 填入 /images/xxx.jpg 替换渐变色背景
  },
  {
    title: "品牌视觉设计",
    category: "Branding",
    desc: "为某新消费品牌设计完整的视觉识别体系",
    color: "from-orange-400 to-rose-500",
    image: "",
  },
  {
    title: "电商主图设计",
    category: "E-commerce",
    desc: "多平台电商主图设计，提升点击率 35%",
    color: "from-cyan-400 to-blue-500",
    image: "",
  },
  {
    title: "插画创作",
    category: "Illustration",
    desc: "以 AI 为起点，手绘润色的插画系列作品",
    color: "from-emerald-400 to-teal-500",
    image: "",
  },
  {
    title: "UI 界面设计",
    category: "UI Design",
    desc: "社交 App 的核心界面设计，含组件库",
    color: "from-amber-400 to-orange-500",
    image: "",
  },
  {
    title: "海报设计",
    category: "Poster",
    desc: "结合 AI 生成与手工合成的系列海报",
    color: "from-pink-400 to-rose-600",
    image: "",
  },
];

// ---------- 博客文章 ----------
export const posts = [
  {
    slug: "midjourney-commercial",
    title: "如何用 Midjourney 生成高质量商业图片",
    desc: "系统梳理从 Prompt 撰写到图片精修的完整商业创作流程，附 50 个实用提示词模板。",
    tag: "AI创作",
    date: "2026-05-08",
    readTime: "8 min",
    content: `
这里是文章正文，支持换行。

## 第一部分

正文内容……

## 第二部分

正文内容……
    `.trim(),
  },
  {
    slug: "ecommerce-design-rules",
    title: "电商主图设计的 10 个黄金法则",
    desc: "结合数百张主图的数据分析，总结出真正提升点击率的视觉设计原则。",
    tag: "设计",
    date: "2026-04-20",
    readTime: "6 min",
    content: `文章正文内容……`.trim(),
  },
  {
    slug: "ai-designer-survival",
    title: "AI 时代设计师的生存指南",
    desc: "AI 工具普及后，设计师的核心竞争力在哪里？",
    tag: "思考",
    date: "2026-03-15",
    readTime: "10 min",
    content: `文章正文内容……`.trim(),
  },
];

// ---------- 关于我页面 ----------
export const about = {
  intro: [
    "一名 AI 创作者与视觉设计师，相信技术与美学的结合能创造出真正有价值的东西。",
    "我花了多年时间研究设计语言，在 AI 工具兴起后，开始探索如何用 AI 扩展创作的边界。",
  ],
  skills: [
    { name: "AI 图像生成", items: ["Midjourney", "Stable Diffusion", "DALL·E", "Flux"] },
    { name: "设计工具",    items: ["Figma", "Photoshop", "Illustrator", "After Effects"] },
    { name: "AI 文字创作", items: ["Claude", "GPT-4", "提示词工程", "内容策划"] },
    { name: "其他技能",    items: ["品牌策划", "电商视觉", "社媒运营", "用户体验"] },
  ],
  experiences: [
    { year: "2024 — 现在", role: "独立 AI 创作者", desc: "专注 AI 辅助创作与视觉设计，服务多家品牌客户" },
    { year: "2022 — 2024", role: "高级视觉设计师", desc: "负责电商品牌视觉体系搭建，管理设计团队" },
    { year: "2020 — 2022", role: "UI / 平面设计师", desc: "从事互联网产品界面设计与品牌视觉工作" },
  ],
};

// ---------- 联系区块 ----------
export const contact = {
  heading: "有合作想法？",
  subtext: "无论是设计项目、AI 咨询还是内容合作，欢迎随时联系。",
  buttonLabel: "发送邮件 →",
};
