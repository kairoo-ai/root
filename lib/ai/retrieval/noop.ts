import type { Retriever } from "./types";
export const noopRetriever: Retriever = { async retrieve() { return []; } };
