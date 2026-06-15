export const env = {
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  computeServiceUrl: process.env.COMPUTE_SERVICE_URL ?? "",
  computeSharedSecret: process.env.COMPUTE_SHARED_SECRET ?? "",
} as const;
