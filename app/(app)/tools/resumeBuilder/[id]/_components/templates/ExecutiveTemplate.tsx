import type { ResumeSections } from '@/types/resume'

interface Props { sections: ResumeSections }

export default function ExecutiveTemplate({ sections }: Props) {
  const { contact, summary, experience, education, skills, projects, certifications } = sections

  return (
    <div className="p-10 font-[Georgia,serif] text-[13px] leading-[1.6] text-[#1a1a1a]">
      {/* Header - centered */}
      <div className="text-center mb-6 pb-5 border-b-2 border-[#1a1a1a]">
        <h1 className="text-[28px] font-bold tracking-wide uppercase">{contact.name || 'Your Name'}</h1>
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 text-[11px] text-[#555]">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
          {contact.github && <span>{contact.github}</span>}
        </div>
      </div>

      {summary.text && (
        <ESection title="Executive Profile">
          <p className="italic text-[13.5px] text-[#333] leading-relaxed">{summary.text}</p>
        </ESection>
      )}

      {experience.length > 0 && (
        <ESection title="Professional Experience">
          {experience.map((e) => (
            <div key={e.id} className="mb-5">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-[14px]">{e.role}</span>
                  <span className="text-[#555] ml-2">&mdash; {e.company}{e.location ? `, ${e.location}` : ''}</span>
                </div>
                <span className="text-[11px] text-[#777] shrink-0 ml-4">{e.startDate}{e.startDate ? ' – ' : ''}{e.isCurrent ? 'Present' : e.endDate}</span>
              </div>
              <ul className="mt-1.5 ml-5 list-disc text-[12.5px] text-[#333] space-y-0.5">
                {e.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          ))}
        </ESection>
      )}

      {education.length > 0 && (
        <ESection title="Education">
          {education.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold">{e.institution}</span>
                <span className="text-[11px] text-[#777]">{e.startDate}{e.startDate ? '–' : ''}{e.endDate}</span>
              </div>
              <div className="text-[12px] text-[#555]">{e.degree}{e.field ? `, ${e.field}` : ''}{e.gpa ? ` · GPA ${e.gpa}` : ''}</div>
            </div>
          ))}
        </ESection>
      )}

      {skills.length > 0 && (
        <ESection title="Core Competencies">
          <div className="flex flex-wrap gap-x-6 gap-y-0.5">
            {skills.flatMap((s) => s.items).map((item, i) => (
              <span key={i} className="text-[12.5px]">· {item}</span>
            ))}
          </div>
        </ESection>
      )}

      {projects.length > 0 && (
        <ESection title="Key Projects">
          {projects.map((p) => (
            <div key={p.id} className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-[13px]">{p.name}</span>
                {p.tech.length > 0 && <span className="text-[11px] text-[#777]">{p.tech.join(', ')}</span>}
              </div>
              {p.description && <p className="text-[12px] text-[#555]">{p.description}</p>}
              <ul className="mt-0.5 ml-5 list-disc text-[12.5px] text-[#333] space-y-0.5">
                {p.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          ))}
        </ESection>
      )}

      {certifications.length > 0 && (
        <ESection title="Certifications">
          {certifications.map((c, i) => (
            <div key={i} className="text-[12.5px] mb-1">
              <span className="font-bold">{c.name}</span>
              {c.issuer && <span className="text-[#555]"> · {c.issuer}</span>}
              {c.date && <span className="text-[#777]"> · {c.date}</span>}
            </div>
          ))}
        </ESection>
      )}
    </div>
  )
}

function ESection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-[11.5px] font-bold uppercase tracking-[0.15em] text-[#1a1a1a] mb-2">{title}</h2>
      <div className="border-t border-[#ccc] pt-2">{children}</div>
    </div>
  )
}
