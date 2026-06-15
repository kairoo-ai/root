'use client';

/**
 * Tabs - thin wrapper around HeroUI v3's real Tabs.
 *
 * Source of truth: https://heroui.com/docs/react/components/tabs
 * Verified against installed @heroui/react v3.1.0
 *   (dist/components/tabs/{index,tabs}.d.ts and @heroui/styles tabs.styles.d.ts).
 *
 * HeroUI ships a COMPOUND `Tabs`: the export is callable (it is the Root) AND
 * carries attached sub-parts:
 *   Tabs.Root | Tabs.ListContainer | Tabs.List | Tabs.Tab |
 *   Tabs.Indicator | Tabs.Separator | Tabs.Panel
 *
 * It also exports each part as a flat named primitive. We re-export BOTH styles
 * so callers can pick whichever reads best:
 *
 *   // compound (recommended)
 *   import { Tabs } from "@/components/ui/Tabs";
 *   <Tabs defaultSelectedKey="overview">
 *     <Tabs.List aria-label="Sections">
 *       <Tabs.Tab id="overview">Overview</Tabs.Tab>
 *       <Tabs.Tab id="metrics">Metrics</Tabs.Tab>
 *     </Tabs.List>
 *     <Tabs.Panel id="overview">…</Tabs.Panel>
 *     <Tabs.Panel id="metrics">…</Tabs.Panel>
 *   </Tabs>
 *
 *   // flat parts
 *   import { TabList, Tab, TabPanel } from "@/components/ui/Tabs";
 *
 * Compound part ↔ flat name map (same components):
 *   Tabs.Root          === TabsRoot
 *   Tabs.ListContainer === TabListContainer
 *   Tabs.List          === TabList
 *   Tabs.Tab           === Tab
 *   Tabs.Indicator     === TabIndicator   (the selection indicator)
 *   Tabs.Separator     === TabSeparator
 *   Tabs.Panel         === TabPanel
 *
 * Key props (v3):
 *   - variant: "primary" | "secondary"            → on Tabs (default "primary")
 *   - orientation: "horizontal" | "vertical"      → on Tabs (default "horizontal")
 *   - selectedKey / defaultSelectedKey / onSelectionChange → on Tabs (controlled vs uncontrolled)
 *   - id          → on Tabs.Tab and Tabs.Panel (a Panel renders when its id matches the selected tab)
 *   - isDisabled  → on Tabs.Tab
 *   - aria-label  → on Tabs.List
 * NOTE: v3 Tabs has NO `size` prop. The only style variant is `variant`.
 *
 * Token-only: colors come from HeroUI's themed CSS variables wired in
 * app/globals.css. No hardcoded colors here.
 */

export {
  // Compound default - `Tabs` is callable AND has .Root/.List/.Tab/.Panel/etc.
  Tabs,

  // Flat named primitives (same components, attached on the compound above).
  TabsRoot,
  TabListContainer,
  TabList,
  Tab,
  TabIndicator,
  TabSeparator,
  TabPanel,

  // Style recipe, in case a caller needs to compose tokens.
  tabsVariants,
} from '@heroui/react';

export type {
  TabsProps, // alias of TabsRootProps
  TabsRootProps,
  TabListContainerProps,
  TabListProps,
  TabProps,
  TabIndicatorProps,
  TabSeparatorProps,
  TabPanelProps,
  TabsVariants,
} from '@heroui/react';

// Default export mirrors the compound for `import Tabs from "@/components/ui/Tabs"`.
export { Tabs as default } from '@heroui/react';
