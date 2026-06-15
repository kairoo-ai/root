import { z } from "zod";

export const embedResponseSchema = z.object({
  model: z.string(),
  dim: z.number(),
  vectors: z.array(z.array(z.number())),
});

export type EmbedResponse = z.infer<typeof embedResponseSchema>;
