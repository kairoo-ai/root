// Backward-compatible shim.
//
// The tool registry now lives in `@/engines/ai/features/registry` (the canonical
// home per docs/ARCHITECTURE.md). This module re-exports it under the original
// names so existing UI consumers — app/(marketing)/page.tsx and
// components/FeatureModal.tsx — keep working unchanged.
//
// It imports the PURE feature registry directly (not the engines/ai barrel), so
// nothing secret/server-only is pulled into client bundles.

import {
  features,
  getFeature,
  type FeatureDef,
  type FeatureInput,
} from '@/engines/ai/features/registry';

export type ToolInput = FeatureInput;
export type Tool = FeatureDef;

// Display-only shape kept for backward compatibility (FeatureModal imports it as
// the `tool` prop type, page.tsx uses `typeof careerTools[0]`).
export interface CareerTool {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const tools: Tool[] = features;
export const careerTools: Tool[] = features.filter((t) => t.category === 'career');
export const learningFeatures: Tool[] = features.filter((t) => t.category === 'learning');

export function getTool(id: string): Tool | undefined {
  return getFeature(id);
}

const genericInput: ToolInput = {
  id: 'input', label: 'Your query', type: 'textarea', placeholder: 'Enter your query...', required: true,
};

export function generateInputsForTool(toolId: string): ToolInput[] {
  const tool = getFeature(toolId);
  if (!tool || tool.inputs.length === 0) return [genericInput];
  return tool.inputs;
}
