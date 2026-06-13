export interface FeatureDef {
  id: string;
  label: string;
  inputs: { id: string; type: string; placeholder?: string }[];
}

export const featureRegistry: Record<string, FeatureDef> = {};
