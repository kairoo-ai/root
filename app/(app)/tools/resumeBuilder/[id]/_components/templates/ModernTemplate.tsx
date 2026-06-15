import type { ResumeSections } from '@/types/resume'

interface Props { sections: ResumeSections }

export default function ModernTemplate({ sections }: Props) {
  const { contact, summary, experience, education, skills, projects, certifications } = sections

  return (
    <div className="flex font-[Inter,sans-serif] text-[13px] leading-[1.55] min-h-full">
      {/* Sidebar */}
      <div className="w-[200px] min-h-full bg-[#1a1a2e] text-white p-6 flex flex-col gap-5 shrink-0">
        <div>
          <h1 className="text-[17px] font-bold leading-tight">{contact.name || 'Your Name'}</h1>
        </div>

        <SideSection title="Contact">
          <div className="flex flex-col gap-0.5 text-[11px] text-white/70">
            {contact.email && <span className="break-all">{contact.email}</span>}
            {contact.phone && <span>{contact.phone}</span>}
            {contact.location && <span>{contact.location}</span>}
            {contact.linkedin && <span className="break-all">{contact.linkedin}</span>}
            {contact.github && <span className="break-all">{contact.github}</span>}
          </div>
        </SideSection>

        {skills.length > 0 && (
          <SideSection title="Skills">
            {skills.map((s, i) => (
              <div key={i} className="mb-1.5">
                {s.category && <div className="text-[10px] font-semibold uppercase text-white/50 tracking-wider mb-0.5">{s.category}</div>}
                <div className="text-[11px] text-white/80">{s.items.join(' · ')}</div>
              </div>
            ))}
          </SideSection>
        )}

        {certifications.length > 0 && (
          <SideSection title="Certifications">
            {certifications.map((c, i) => (
              <div key={i} className="text-[11px] text-white/70 mb-1">
                <div className="font-medium text-white/90">{c.name}</div>
                {c.issuer && <div>{c.issuer}</div>}
                {c.date && <div className="text-white/50">{c.date}</div>}
              </div>
            ))}
          </SideSection>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 p-8 bg-white text-[#111]">
        {summary.text && (
          <MainSection title="Profile">
            <p>{summary.text}</p>
          </MainSection>
        )}

        {experience.length > 0 && (
          <MainSection title="Experience">
            {experience.map((e) => (
              <div key={e.id} className="mb-4">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold text-[14px]">{e.role}</div>
                    <div className="text-[12px] text-[#555]">{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                  </div>
                  <div className="text-[11px] text-[#888] shrink-0 ml-4 pt-0.5">{e.startDate}{e.startDate ? '–' : ''}{e.isCurrent ? 'Present' : e.endDate}</div>
                </div>
                <ul className="mt-1.5 ml-4 list-disc text-[12.5px] text-[#333] space-y-0.5">
                  {e.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </MainSection>
        )}

        {education.length > 0 && (
          <MainSection title="Education">
            {education.map((e) => (
              <div key={e.id} className="mb-2.5">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{e.institution}</div>
                    <div className="text-[12px] text-[#555]">{e.degree}{e.field ? `, ${e.field}` : ''}</div>
                  </div>
                  <div className="text-[11px] text-[#888]">{e.startDate}{e.startDate ? '–' : ''}{e.endDate}</div>
                </div>
              </div>
            ))}
          </MainSection>
        )}

        {projects.length > 0 && (
          <MainSection title="Projects">
            {projects.map((p) => (
              <div key={p.id} className="mb-3">
                <div className="font-semibold">{p.name}</div>
                {p.description && <p className="text-[12px] text-[#555]">{p.description}</p>}
                <ul className="mt-1 ml-4 list-disc text-[12.5px] text-[#333] space-y-0.5">
                  {p.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                {p.tech.length > 0 && <div className="mt-0.5 text-[11px] text-[#777]">{p.tech.join(' · ')}</div>}
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  )
}

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/40 mb-1.5">{title}</div>
      {children}
    </div>
  )
}

function MainSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1a1a2e] border-b-2 border-[#1a1a2e] pb-0.5 mb-2">{title}</h2>
      {children}
    </div>
  )
}
