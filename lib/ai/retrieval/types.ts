export type RetrievedChunk = { text: string; source?: string; score?: number };
export interface Retriever {
  retrieve(query: string, k?: number): Promise<RetrievedChunk[]>;
}
