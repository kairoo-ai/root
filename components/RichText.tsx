import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Kairoo-branded markdown renderer. Replaces the generic Tailwind `prose`
 * classes with on-brand element styling that works in light AND dark.
 * Reuse anywhere we render markdown (AI output, legal pages).
 */
export default function RichText({ children }: { children: string }) {
  return (
    <div className="font-sans text-[15px] leading-relaxed text-foreground/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (p: ComponentPropsWithoutRef<"h1">) => (
            <h1 className="mt-6 mb-3 text-2xl font-extrabold tracking-tight text-brand-ink" {...p} />
          ),
          h2: (p: ComponentPropsWithoutRef<"h2">) => (
            <h2 className="mt-6 mb-3 text-xl font-bold tracking-tight text-brand-ink" {...p} />
          ),
          h3: (p: ComponentPropsWithoutRef<"h3">) => (
            <h3 className="mt-5 mb-2 text-lg font-bold text-brand-ink" {...p} />
          ),
          p: (p: ComponentPropsWithoutRef<"p">) => <p className="my-3" {...p} />,
          a: (p: ComponentPropsWithoutRef<"a">) => (
            <a className="text-brand-teal underline decoration-brand-teal/40 underline-offset-2 hover:decoration-brand-teal" {...p} />
          ),
          ul: (p: ComponentPropsWithoutRef<"ul">) => (
            <ul className="my-3 ml-5 list-disc marker:text-brand-teal" {...p} />
          ),
          ol: (p: ComponentPropsWithoutRef<"ol">) => (
            <ol className="my-3 ml-5 list-decimal marker:text-brand-teal" {...p} />
          ),
          li: (p: ComponentPropsWithoutRef<"li">) => <li className="my-1" {...p} />,
          blockquote: (p: ComponentPropsWithoutRef<"blockquote">) => (
            <blockquote className="my-4 border-l-2 border-brand-teal pl-4 italic text-muted-foreground" {...p} />
          ),
          strong: (p: ComponentPropsWithoutRef<"strong">) => (
            <strong className="font-semibold text-brand-ink" {...p} />
          ),
          code: (p: ComponentPropsWithoutRef<"code">) => (
            <code className="rounded bg-brand-teal/10 px-1.5 py-0.5 text-[0.9em] text-brand-teal" {...p} />
          ),
          pre: (p: ComponentPropsWithoutRef<"pre">) => (
            <pre className="my-4 overflow-x-auto rounded-xl bg-brand-navy p-4 text-brand-mist" {...p} />
          ),
          hr: (p: ComponentPropsWithoutRef<"hr">) => (
            <hr className="my-6 border-brand-teal/20" {...p} />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
