// Fails if raw colors appear in app/ or components/ outside the allowlist.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["app", "components"];
const EXfiles = new Set([
  "app/styles/tokens.generated.css",
  "app/globals.css",
  "app/icon.svg",
  "app/apple-icon.svg",
]);
// Legacy files awaiting rewrite - tagged DESIGN-DEBT. Allowed to keep raw colors for now.
const LEGACY = new Set([
  "app/(app)/activity/_components/ActivityPageClient.tsx",
  "app/(app)/dashboard/_components/ActivityFeed.tsx",
  "app/(app)/dashboard/_components/QuickLaunch.tsx",
  "app/(app)/dashboard/_components/StatsGrid.tsx",
  "app/(app)/dashboard/_components/UsageWidget.tsx",
  "app/(app)/dashboard/_components/WelcomeBanner.tsx",
  "app/(app)/progress/_components/ProgressPageClient.tsx",
  "app/(app)/roadmaps/[id]/_components/RoadmapKanban.tsx",
  "app/(app)/roadmaps/[id]/_components/RoadmapPhases.tsx",
  "app/(app)/roadmaps/[id]/_components/RoadmapProgress.tsx",
  "app/(app)/roadmaps/[id]/_components/RoadmapTimeline.tsx",
  "app/(app)/roadmaps/[id]/_components/StepDrawer.tsx",
  "app/(app)/roadmaps/_components/RoadmapsList.tsx",
  "app/(app)/roadmaps/new/_components/RoadmapWizard.tsx",
  "app/(app)/settings/billing/_components/BillingPageClient.tsx",
  "app/(app)/settings/connections/_components/ConnectorCard.tsx",
  "app/(app)/settings/profile/_components/ProfileForm.tsx",
  "app/(app)/settings/security/page.tsx",
  "app/(app)/tools/[featureId]/_components/ChatInput.tsx",
  "app/(app)/tools/[featureId]/_components/ThreadSidebar.tsx",
  "app/(app)/tools/[featureId]/_components/ToolPageClient.tsx",
  "app/(app)/tools/interviewPrep/_components/FeedbackPanel.tsx",
  "app/(app)/tools/interviewPrep/_components/HubClientSection.tsx",
  "app/(app)/tools/interviewPrep/_components/QuestionBankCard.tsx",
  "app/(app)/tools/interviewPrep/_components/SessionScoreCard.tsx",
  "app/(app)/tools/interviewPrep/_components/WeaknessHeatmap.tsx",
  "app/(app)/tools/interviewPrep/page.tsx",
  "app/(app)/tools/interviewPrep/session/[id]/_components/STARCoach.tsx",
  "app/(app)/tools/interviewPrep/setup/page.tsx",
  "app/(app)/tools/page.tsx",
  "app/(app)/tools/resumeBuilder/[id]/_components/ATSSidebar.tsx",
  "app/(app)/tools/resumeBuilder/[id]/_components/BulletEditor.tsx",
  "app/(app)/tools/resumeBuilder/[id]/_components/CoverLetterPanel.tsx",
  "app/(app)/tools/resumeBuilder/[id]/_components/ResumePreview.tsx",
  "app/(app)/tools/resumeBuilder/[id]/_components/SectionEditor.tsx",
  "app/(app)/tools/resumeBuilder/[id]/_components/TailorModal.tsx",
  "app/(app)/tools/resumeBuilder/[id]/_components/templates/CreativeTemplate.tsx",
  "app/(app)/tools/resumeBuilder/[id]/_components/templates/ExecutiveTemplate.tsx",
  "app/(app)/tools/resumeBuilder/[id]/_components/templates/MinimalTemplate.tsx",
  "app/(app)/tools/resumeBuilder/[id]/_components/templates/ModernTemplate.tsx",
  "app/(app)/tools/resumeBuilder/[id]/page.tsx",
  "app/(app)/tools/resumeBuilder/page.tsx",
  "app/(app)/tools/skillGap/_client.tsx",
  "app/(app)/tools/skillGap/_components/LearningPlanTimeline.tsx",
  "app/(app)/tools/skillGap/_components/PriorityMatrix.tsx",
  "app/(app)/tools/skillGap/_components/SalaryImpactCard.tsx",
  "app/(app)/tools/skillGap/_components/SkillGapCard.tsx",
  "app/(app)/tools/skillGap/_components/SkillRadarChart.tsx",
  "app/(app)/tools/skillGap/_components/SkillTreeGraph.tsx",
  "app/(app)/tools/skillGap/assess/_client.tsx",
  "app/(auth)/verify/page.tsx",
  "app/(marketing)/features/FeaturesExtended.tsx",
  "app/(marketing)/how-it-works/HowItWorksExtended.tsx",
  "app/onboarding/_components/steps/StepBackground.tsx",
  "app/onboarding/_components/steps/StepImport.tsx",
  "app/onboarding/_components/steps/StepWelcome.tsx",
  "components/aceternity/CanvasText.tsx",
  "components/aceternity/CardSpotlight.tsx",
  "components/aceternity/SparklesCore.tsx",
  "components/shells/AppShell.tsx",
  "components/ui/CommandPalette.tsx",
]);
const RAW =
  /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|\b(?:bg|text|border|from|via|to|fill|stroke|ring|shadow|decoration|outline|divide)-\[#|\b(?:bg|text|border|from|via|to|fill|stroke|ring|shadow|decoration|outline|divide)-(?:slate|gray|zinc|stone|red|orange|yellow|lime|green|emerald|cyan|sky|blue|indigo|violet|fuchsia|pink|rose|purple)-[0-9]/;
const exts = new Set([".ts", ".tsx", ".css"]);

const files = [];
const walk = (dir) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (exts.has(extname(p))) files.push(p);
  }
};
ROOTS.forEach((r) => walk(r));

const offenders = [];
for (const f of files) {
  const rel = f.replaceAll("\\", "/");
  if (EXfiles.has(rel) || LEGACY.has(rel)) continue;
  const txt = readFileSync(f, "utf8");
  txt.split("\n").forEach((line, i) => {
    if (RAW.test(line))
      offenders.push(`${rel}:${i + 1}: ${line.trim().slice(0, 100)}`);
  });
}

if (offenders.length) {
  console.error(
    "Raw colors found (use design tokens instead):\n" + offenders.join("\n"),
  );
  process.exit(1);
}
console.log(
  `Color guard passed (${files.length} files scanned, ${LEGACY.size} legacy files allowlisted).`,
);
