import type { ResumeSections } from '@/types/resume'

interface Props { sections: ResumeSections }

export default function MinimalTemplate({ sections }: Props) {
  const { contact, summary, experience, education, skills, projects, certifications } = sections

  return (
    <div className="p-10 font-[Inter,sans-serif] text-[#111] text-[13px] leading-[1.5]">
      {/* Header */}
      <div className="mb-5 border-b border-[#e0e0e0] pb-4">
        <h1 className="text-[26px] font-bold tracking-tight text-[#111]">{contact.name || 'Your Name'}</h1>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-[#555]">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
          {contact.github && <span>{contact.github}</span>}
          {contact.portfolio && <span>{contact.portfolio}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary.text && (
        <Section title="Summary">
          <p className="text-[13px] text-[#333]">{summary.text}</p>
        </Section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[14px]">{e.role}</span>
                <span className="text-[11px] text-[#777]">{e.startDate}{e.startDate ? ' - ' : ''}{e.isCurrent ? 'Present' : e.endDate}</span>
              </div>
              <div className="text-[12px] text-[#555]">{e.company}{e.location ? ` · ${e.location}` : ''}</div>
              <ul className="mt-1 ml-4 list-disc text-[12.5px] text-[#333] space-y-0.5">
                {e.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="Education">
          {education.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[13px]">{e.institution}</span>
                <span className="text-[11px] text-[#777]">{e.startDate}{e.startDate ? ' - ' : ''}{e.endDate}</span>
              </div>
              <div className="text-[12px] text-[#555]">{e.degree}{e.field ? `, ${e.field}` : ''}{e.gpa ? ` · GPA ${e.gpa}` : ''}</div>
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="Skills">
          {skills.map((s, i) => (
            <div key={i} className="text-[12.5px]">
              {s.category && <span className="font-semibold">{s.category}: </span>}
              <span className="text-[#333]">{s.items.join(', ')}</span>
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p) => (
            <div key={p.id} className="mb-2">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-[13px]">{p.name}</span>
                {p.tech.length > 0 && <span className="text-[11px] text-[#777]">{p.tech.join(', ')}</span>}
              </div>
              {p.description && <p className="text-[12px] text-[#555]">{p.description}</p>}
              <ul className="mt-0.5 ml-4 list-disc text-[12.5px] text-[#333] space-y-0.5">
                {p.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section title="Certifications">
          {certifications.map((c, i) => (
            <div key={i} className="text-[12.5px]">
              <span className="font-semibold">{c.name}</span>
              {c.issuer && <span className="text-[#555]"> · {c.issuer}</span>}
              {c.date && <span className="text-[#777]"> · {c.date}</span>}
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#888] mb-1.5 border-b border-[#e8e8e8] pb-0.5">{title}</h2>
      {children}
    </div>
  )
}
