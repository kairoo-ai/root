// TODO: validate with zod once installed; this module is server-only by convention
export const env = {
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
} as const;
