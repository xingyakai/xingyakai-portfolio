import { about, siteConfig, contact } from "@/data/content";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="px-8 max-w-5xl mx-auto mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs tracking-widest text-neutral-400 uppercase mb-4">About</p>
            <h1 className="text-6xl font-black mb-8 leading-tight">Hi，我是<br />{siteConfig.name}</h1>
            {about.intro.map((p, i) => (
              <p key={i} className="text-neutral-500 leading-relaxed mb-4 text-lg">{p}</p>
            ))}
            <a href={`mailto:${siteConfig.email}`} className="inline-block mt-6 px-8 py-3 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-700 transition-colors">
              发邮件给我
            </a>
          </div>
          <div className="aspect-square rounded-3xl bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center">
            <div className="text-center text-violet-400">
              <div className="text-8xl mb-4">✦</div>
              <p className="text-sm">放置你的头像</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 max-w-5xl mx-auto mb-24">
        <p className="text-xs tracking-widest text-neutral-400 uppercase mb-4">Skills</p>
        <h2 className="text-4xl font-bold mb-12">专业技能</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {about.skills.map((skill) => (
            <div key={skill.name} className="p-6 border border-neutral-100 rounded-2xl hover:border-neutral-300 transition-colors">
              <h3 className="font-semibold mb-4 text-sm text-neutral-500 uppercase tracking-wide">{skill.name}</h3>
              <ul className="space-y-2">
                {skill.items.map((item) => (
                  <li key={item} className="text-sm font-medium flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-neutral-400 inline-block" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="px-8 max-w-5xl mx-auto mb-24">
        <p className="text-xs tracking-widest text-neutral-400 uppercase mb-4">Experience</p>
        <h2 className="text-4xl font-bold mb-12">工作经历</h2>
        <div className="space-y-0">
          {about.experiences.map((exp, i) => (
            <div key={i} className="flex gap-12 py-8 border-b border-neutral-100">
              <div className="w-36 flex-shrink-0 text-sm text-neutral-400">{exp.year}</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{exp.role}</h3>
                <p className="text-neutral-500 text-sm">{exp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-8 max-w-5xl mx-auto">
        <div className="bg-neutral-900 text-white rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-black mb-4">{contact.heading}</h2>
          <p className="text-neutral-400 mb-8">{contact.subtext}</p>
          <a href={`mailto:${siteConfig.email}`} className="inline-block px-8 py-3 bg-white text-neutral-900 rounded-full text-sm font-semibold hover:bg-neutral-100 transition-colors">
            {contact.buttonLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
