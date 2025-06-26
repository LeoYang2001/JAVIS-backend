// memory/qdrant/todo/search.ts
import { qdrant } from "../client/qdrantClient";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function searchTodos(query: string, topK = 3) {
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  const vector = embeddingResponse.data[0].embedding;

  const results = await qdrant.search("todo_memory", {
    vector,
    limit: topK,
    with_payload: true,
  });

  return results.map((res) => ({
    content: res.payload?.content,
    sqlId: res.payload?.sqlId,
    score: res.score,
  }));
}
