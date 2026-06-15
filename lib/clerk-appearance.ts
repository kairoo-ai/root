// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Appearance = any;

/**
 * Shared Clerk appearance - uses our CSS custom properties so it
 * automatically adapts to light/dark mode via next-themes class toggle.
 *
 * Applied at the ClerkProvider level (root layout) so every Clerk-rendered
 * surface (SignIn, SignUp, UserButton, UserProfile) is consistently styled.
 */
export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: "var(--primary)",
    colorBackground: "var(--background)",
    colorText: "var(--foreground)",
    colorTextSecondary: "var(--muted-foreground)",
    colorInputText: "var(--foreground)",
    colorInputBackground: "var(--card)",
    colorDanger: "var(--destructive)",
    colorSuccess: "oklch(0.56 0.15 150)",
    fontFamily:
      "var(--font-dm-sans), ui-sans-serif, system-ui, -apple-system, sans-serif",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    spacingUnit: "1rem",
  },
  elements: {
    /* ── Card / root ──────────────────────────────────────── */
    rootBox: "w-full",
    card: [
      "bg-card text-card-foreground",
      "border border-border",
      "shadow-elevation-2",
      "rounded-2xl",
      "p-2",
    ].join(" "),

    /* ── Header ───────────────────────────────────────────── */
    headerTitle: "text-h3 text-foreground font-bold tracking-tight",
    headerSubtitle: "text-body-sm text-muted-foreground mt-1",

    /* ── Social / OAuth buttons ───────────────────────────── */
    socialButtonsBlockButton: [
      "border border-border bg-card text-foreground",
      "hover:bg-accent-subtle hover:text-foreground",
      "transition-colors rounded-lg font-medium",
    ].join(" "),
    socialButtonsBlockButtonText: "font-medium text-foreground",

    /* ── Divider ──────────────────────────────────────────── */
    dividerLine: "bg-border",
    dividerText: "text-muted-foreground text-body-sm",

    /* ── Form fields ──────────────────────────────────────── */
    formFieldLabel: "text-body-sm font-medium text-foreground",
    formFieldInput: [
      "bg-card border border-border text-foreground",
      "placeholder:text-muted-foreground",
      "focus:border-primary focus:ring-2 focus:ring-primary/20",
      "rounded-lg transition-colors",
    ].join(" "),
    formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
    formFieldErrorText: "text-destructive text-body-sm",
    formFieldHintText: "text-muted-foreground text-body-sm",

    /* ── Primary action button ────────────────────────────── */
    formButtonPrimary: [
      "bg-primary text-primary-foreground",
      "hover:opacity-90 active:opacity-80",
      "font-semibold rounded-lg transition-opacity",
      "shadow-none",
    ].join(" "),
    formButtonReset: "text-muted-foreground hover:text-foreground text-body-sm",

    /* ── Footer ───────────────────────────────────────────── */
    footer: "border-t border-border",
    footerAction: "mt-0",
    footerActionText: "text-muted-foreground text-body-sm",
    footerActionLink: "text-primary hover:opacity-80 font-medium transition-opacity",

    /* ── Identity preview ─────────────────────────────────── */
    identityPreviewText: "text-foreground text-body-sm",
    identityPreviewEditButton: "text-primary hover:opacity-80 transition-opacity",

    /* ── Alert / error banner ─────────────────────────────── */
    alertText: "text-destructive text-body-sm",
    alert: "bg-destructive/10 border border-destructive/20 rounded-lg",

    /* ── OTP / verification ───────────────────────────────── */
    otpCodeFieldInput: [
      "bg-card border border-border text-foreground",
      "focus:border-primary focus:ring-2 focus:ring-primary/20",
      "rounded-lg font-mono",
    ].join(" "),
    formResendCodeLink: "text-primary hover:opacity-80 font-medium transition-opacity",

    /* ── UserButton ───────────────────────────────────────── */
    userButtonAvatarBox: "rounded-full ring-2 ring-border",
    userButtonPopoverCard: [
      "bg-card border border-border shadow-elevation-3 rounded-2xl",
    ].join(" "),
    userButtonPopoverActionButton: [
      "text-foreground hover:bg-accent-subtle rounded-lg transition-colors",
    ].join(" "),
    userButtonPopoverActionButtonText: "text-body-sm font-medium",
    userButtonPopoverFooter: "border-t border-border",

    /* ── UserProfile ──────────────────────────────────────── */
    navbar: "bg-card border-r border-border",
    navbarButton: [
      "text-muted-foreground hover:text-foreground hover:bg-accent-subtle",
      "rounded-lg transition-colors",
    ].join(" "),
    navbarButtonIcon: "text-current",
    profileSectionTitle: "text-h5 text-foreground font-semibold",
    profileSectionPrimaryButton: [
      "border border-border bg-card text-foreground",
      "hover:bg-accent-subtle transition-colors rounded-lg",
    ].join(" "),
    profilePage: "bg-background",
    pageScrollBox: "bg-background",
  },
  layout: {
    socialButtonsPlacement: "top",
    showOptionalFields: false,
    shimmer: true,
  },
};
