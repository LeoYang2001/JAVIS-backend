import { config } from "dotenv";
import { QdrantClient } from "@qdrant/js-client-rest";

config();

const client = new QdrantClient({ url: "http://localhost:6333" });

const deleteTodo = async (sqlId: number) => {
  try {
    const response = await client.delete("todo_memory", {
      points: [sqlId],
    });

    console.log(`🗑️  Deleted point with ID ${sqlId} from Qdrant`, response);
  } catch (err) {
    console.error("❌ Failed to delete point:", err);
  }
};

// 👇 Example usage (you can change this ID for testing)
deleteTodo(101);
