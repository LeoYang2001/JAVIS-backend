// memory/qdrant/todo/insert.ts
import { qdrant } from "../client/qdrantClient";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function insertTodo(content: string, sqlId: number) {
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: content,
  });

  const vector = embeddingResponse.data[0].embedding;

  await qdrant.upsert("todo_memory", {
    points: [
      {
        id: sqlId,
        vector,
        payload: {
          content,
          sqlId,
          created_at: new Date().toISOString(),
        },
      },
    ],
  });

  console.log("🧠 Inserted todo:", content);
}
