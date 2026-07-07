'use client';

import { useEffect } from 'react';
import { asset } from '@/lib/asset';

// ─── 简历数据（源自 邢亚凯简历-twodocx.docx）────────────────────
const STRENGTHS = [
  { t: '多模态数据与评测项目管理', d: '具备 VLM 视频理解、图生视频评测、镜头语言 SFT、图像美学 Caption 等项目经验，能够承接算法/业务需求，协调标注、质检、评测资源，推进数据建设、质量验收和模型评测交付。' },
  { t: '标注规则与质检标准设计', d: '擅长将金融知识、图表含义、镜头运动、主体一致性、美学风格等主观判断拆解为可标注、可质检、可复评的规则与指标，提升训练数据可用性和评测一致性。' },
  { t: '模型评测与 Bad Case 分析', d: '熟悉 VLM 与视频生成模型常见 Bad Case，能够通过样本分层、盲评校准、问题归因和评测报告定位模型短板，输出数据补充、规则优化、评测报告和上线风险建议。' },
];

const JOBS = [
  {
    company: '中汇会计师事务所（金融科技 AI 业务）',
    role: '项目负责人',
    date: '2025.08 — 2026.05',
    projects: [
      {
        name: '金融科普 VLM 视频理解评测项目',
        items: [
          { t: '场景化评测体系搭建', d: '围绕开放式视频理解结果难以客观判断的问题，将模型输出拆解为内容理解、视觉证据、时序关系、领域知识和推理表达等评测维度，建立可评分的评测口径。' },
          { t: '全流程标注质控', d: '负责金融科普视频评测集标注管理，采用“试标校准—过程抽检—问题归因—规则完善”的质控闭环，围绕只复述字幕、图表过度推断、风险提示遗漏等问题沉淀 5 类纠偏案例；通过分批抽检和返修复盘统一执行标准，推动评测员一致性由 83% 提升至 92%+。' },
          { t: '评测报告与项目复盘', d: '将开放式视频理解中的主观评价拆解为任务得分、错误分布、Bad Case 类型和问题归因等可量化维度，定位样本覆盖、规则边界和模型理解缺陷，沉淀补充样本方向、评分规则修订点和模型迭代建议，推动评测结论落到后续优化。' },
        ],
      },
      {
        name: '基于 VLM 的金融科普短视频 Caption 数据构建',
        items: [
          { t: '训练样本设计', d: '依托金融专业背景对术语、图表含义和风险表达的敏感度，按“视频主旨—片段语义—视觉证据—金融含义—风险边界”拆解样本结构，形成面向 VLM 训练的多粒度样本构建方案。' },
          { t: '数据质量闭环建设', d: '针对金融术语误写、概念解释泛化、图表结论过度推断、摘要遗漏等问题，建立 Caption 一致性校验和返修规则，提升训练样本的准确性与可用性。' },
          { t: '业务收益', d: '沉淀约 6.5 万条通过质检的训练样本，围绕金融术语、图表语义和风险边界形成可追踪的数据资产，为模型补充金融视频理解和风险表达能力提供训练支撑。' },
        ],
      },
    ],
  },
  {
    company: '万兴科技（Filmora）',
    role: '项目负责人',
    date: '2024.07 — 2025.08',
    projects: [
      {
        name: '图生视频模型推理加速方案评测',
        items: [
          { t: '多维质量评测体系搭建', d: '将“生成变快了但质量是否可用”拆解为效率变化、主体一致性、画面稳定性、运动自然度、指令对齐和美学观感等可观察指标，为每类问题定义扣分口径和 Bad Case 类型，建立“效率—质量—可用性”综合评测标准。' },
          { t: '局部风险识别与调优反馈', d: '在整体 GSB 指标达标背景下，下钻“时长 × 画幅 × 运动复杂度”等交叉维度，识别主体漂移、动作不连贯、画面撕裂、细节模糊、美学下降及长时长横版后段背景跳变等局部劣化风险；对 Bad Case 进行底层归因，输出定向调优建议，支撑算法定位 VAE 时序建模缺陷。' },
          { t: '跨团队沟通与业务落地', d: '面向算法侧输出劣化样本、问题归因和调优建议，面向业务侧明确加速方案的质量风险、可用边界和灰度策略；推动推荐加速方案成功上线，模型推理速度提升 40%，算力成本降低 35%，核心 P0 级问题发生率由 7% 收敛至 3%。' },
        ],
      },
      {
        name: '图生视频镜头语言对齐 SFT 数据',
        items: [
          { t: '镜头语义结构化', d: '将包含运镜、景别变化和主体跟随关系的自然语言描述，拆解为镜头起止状态、画面变化过程、主体与镜头关系等可验证信息，建立“指令—画面变化—验收标准”的对齐样本设计方式。' },
          { t: '模板制定', d: '将图生视频 Prompt 解构为“静态事实层（主体/场景/风格，不可幻觉）+ 动态行为层（主体运动与相机运动解耦）+ 负向约束层（绝对禁止变更属性）”的立体结构，确立全组 SOP 并沉淀为可复用模板库。' },
          { t: '数据风控与 Bad Case 阻断', d: '引入 Python 自动化校验（字段完整性 100% 保障）+ 人工按比例抽检（重点覆盖运动边界 Case）；建立 5 大类 Bad Case 特征库（含运动不连贯、主体形变、背景闪烁等）当日复盘机制，阻断同类错误衍化。' },
          { t: '业务收益', d: '高质量交付 2 万组写实类 SFT 训练集，终验合格率达 96.5%；支撑模型在复杂运镜、主体跟随、景别变化等场景下的理解与生成对齐能力提升，镜头运动判断准确率由 85% 提升至 93%+，团队标注一致性提升至 92%。' },
        ],
      },
    ],
  },
  {
    company: '小红书',
    role: '多模态视觉数据标注员（实习）',
    date: '2024.01 — 2024.06',
    projects: [
      {
        name: '图像美学 Caption 数据建设',
        items: [
          { t: '视觉美学拆解', d: '面向 AI 视觉大模型训练场景，围绕人像、写真、商品图、设计图、插画等素材，拆解色彩、构图、光影、风格、氛围等美学特征，完成结构化标签与 Caption 标注。' },
          { t: '高质量图文对构建', d: '针对普通图片描述缺少审美信息的问题，补充主体、场景、材质、空间关系、光影氛围和艺术风格描述，提升图文数据的信息密度与可训练性。' },
          { t: '业务收益', d: '累计参与约 3000 条图片美学图文对数据建设，返修后通过率保持 95%+，支持 AI 修图、图片生成、设计素材生成和提示词优化等业务场景。' },
        ],
      },
    ],
  },
];

const SKILLS = [
  { t: '视频生成模型与多模态架构认知', d: '深入理解 Diffusion/DiT 视频生成模型的数据诉求；精通 SFT/RLHF 在 Alignment 阶段的数据策略差异；具备高阶 Prompt Engineering 与 Negative Prompt 设计能力；熟悉视频数据的时序—空间—语义三维建模逻辑。' },
  { t: '视频质量评估维度体系', d: '具备图生视频模型、VLM 视频理解等评测经验，能够围绕画面质量、运动合理性、主体一致性和领域知识准确性设计评分规则、盲评流程与 Bad Case 归因，支持模型迭代与上线决策。' },
  { t: 'AI 自动化与工具', d: '熟练使用 Python 进行 Pandas 数据清洗、字段完整性校验、正则规则扫描和质检结果统计；熟悉 Coze / Dify Agent 工作流搭建，可用于高风险样本初筛、规则命中统计和质检结果汇总；具备基础 Git 协作能力。' },
  { t: '数据治理方法论', d: '精通 Calibration 一致性校准、Bad Case 归因建模、分层评测体系构建、SOP 敏捷迭代；具备从 0 到 1 搭建数据质量管线的体系化能力。' },
  { t: '跨团队协同与标准输出', d: '具备算法、产品、数据团队协作经验，能够输出评测报告、数据标准文档、标注 SOP、Bad Case 归因分析等交付物，支持模型迭代、产品决策与数据策略优化。' },
];

export default function ResumePage() {
  useEffect(() => {
    document.title = '邢亚凯 — 简历';
  }, []);

  // 返回：内嵌在外壳(iframe)里则通知外壳关闭浮层，否则回退/回首页
  const back = () => {
    if (typeof window === 'undefined') return;
    if (window.parent && window.parent !== window) {
      window.parent.postMessage('sc-close', '*');
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  let sec = 0;
  const num = () => String(++sec).padStart(2, '0');

  return (
    <div className="resume-page">
      <button className="rs-back" onClick={back}>
        <span>←</span> 返回
      </button>

      <div className="rs-inner">
        {/* ── 头部 ── */}
        <header className="rs-head">
          <p className="rs-eyebrow">RESUME / 个人简历</p>
          <h1 className="rs-name">
            邢亚凯
            <span className="rs-name-en">XING YAKAI</span>
          </h1>
          <p className="rs-tagline">细心从每一个小细节开始。</p>
          <ul className="rs-meta">
            <li><i>PHONE</i>19250118355</li>
            <li><i>EMAIL</i><a href="mailto:3976230068@qq.com">3976230068@qq.com</a></li>
            <li><i>EDU</i>本科 · 投资学</li>
            <li><i>PORTFOLIO</i><a href="https://xingyakai-portfolio.pages.dev/" target="_blank" rel="noopener">xingyakai-portfolio.pages.dev</a></li>
          </ul>
        </header>

        {/* ── 个人优势 ── */}
        <section className="rs-sec">
          <div className="rs-sec-head"><span>{num()}</span><h2>个人优势</h2></div>
          <ul className="rs-points">
            {STRENGTHS.map((s) => (
              <li key={s.t}><b>{s.t}：</b>{s.d}</li>
            ))}
          </ul>
        </section>

        {/* ── 工作 / 实习经历 ── */}
        <section className="rs-sec">
          <div className="rs-sec-head"><span>{num()}</span><h2>工作与实习经历</h2></div>
          {JOBS.map((j) => (
            <article className="rs-job" key={j.company}>
              <div className="rs-job-head">
                <h3>{j.company}<em>{j.role}</em></h3>
                <span className="rs-date">{j.date}</span>
              </div>
              {j.projects.map((p) => (
                <div className="rs-proj" key={p.name}>
                  <p className="rs-proj-name"><span>项目</span>{p.name}</p>
                  <ul className="rs-points">
                    {p.items.map((it) => (
                      <li key={it.t}><b>{it.t}：</b>{it.d}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </article>
          ))}
        </section>

        {/* ── 专业技能 ── */}
        <section className="rs-sec">
          <div className="rs-sec-head"><span>{num()}</span><h2>专业技能</h2></div>
          <ul className="rs-points">
            {SKILLS.map((s) => (
              <li key={s.t}><b>{s.t}：</b>{s.d}</li>
            ))}
          </ul>
        </section>

        <footer className="rs-foot">
          <a className="rs-download" href={asset('/xingyakai-resume.docx')} download>
            ↓ 下载简历 (DOCX)
          </a>
          <span>© 2026 邢亚凯 · XYK</span>
        </footer>
      </div>
    </div>
  );
}
