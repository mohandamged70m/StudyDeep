import { GoogleGenerativeAI } from "@google/generative-ai";

let client: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!client) {
    client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }
  return client;
}

const EMBEDDING_MODEL = "text-embedding-004";

export async function embedText(text: string): Promise<number[]> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  const result = await model.embedContent({ content: { role: "user", parts: [{ text }] } });
  return result.embedding.values;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  const results = await model.batchEmbedContents({ requests: texts.map((t) => ({ content: { role: "user", parts: [{ text: t }] } })) });
  return results.embeddings.map((e) => e.values);
}
