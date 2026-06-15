import Link from "next/link";

type LogoProps = {
  /** glyph height in px (wordmark scales relative to it) */
  size?: number;
  /** show the (process.env.APP_NAME || "Kairoo") wordmark next to the glyph */
  showWordmark?: boolean;
  /** href to wrap the logo in; omit to render unlinked */
  href?: string;
  className?: string;
};

/**
 * Kairoo logo — locked "B3" glyph (arc + curved stem + two teal dots).
 * Theme-aware: strokes use currentColor (text-brand-ink), dots use the teal brand token.
 */
export default function Logo({
  size = 32,
  showWordmark = true,
  href = "/",
  className = "",
}: LogoProps) {
  const glyph = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 92 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="text-brand-ink"
      >
        <path
          d="M16.1016 71.2999C28.3682 68.2332 39.8682 59.0332 50.6016 43.6999C61.3349 28.3666 69.7682 19.9332 75.9016 18.3999"
          stroke="currentColor"
          strokeWidth="8.05"
          strokeLinecap="round"
        />
        <path
          d="M32.0476 21C32.0476 39.55 30.9762 39.2 39 42"
          stroke="currentColor"
          strokeWidth="8.05"
          strokeLinecap="round"
        />
        <circle cx="58" cy="51" r="5" className="fill-brand-primary" />
        <circle cx="75.9016" cy="18.4" r="9.2" className="fill-brand-primary" />
      </svg>
      {showWordmark && (
        <span
          className="font-bold tracking-tight text-brand-ink"
          style={{ fontSize: size * 0.72 }}
        >
          {process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}
        </span>
      )}
      <span className="sr-only">{process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}</span>
    </span>
  );

  return href ? (
    <Link href={href} aria-label={ `${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} home` }>
      {glyph}
    </Link>
  ) : (
    glyph
  );
}
