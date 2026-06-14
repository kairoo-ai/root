import type { Message } from "../types";
import { BASE_PROMPT } from "./base";
import type { RetrievedChunk } from "../retrieval/types";

export function compose(opts: {
  systemAddendum?: string;
  userPrompt: string;
  context?: RetrievedChunk[];
}): Message[] {
  const system = [BASE_PROMPT, opts.systemAddendum].filter(Boolean).join("\n\n");
  const messages: Message[] = [{ role: "system", content: system }];
  if (opts.context && opts.context.length) {
    const ctx = opts.context.map((c, i) => `[${i + 1}] ${c.text}`).join("\n\n");
    messages.push({ role: "system", content: `Relevant context:\n${ctx}` });
  }
  messages.push({ role: "user", content: opts.userPrompt });
  return messages;
}
