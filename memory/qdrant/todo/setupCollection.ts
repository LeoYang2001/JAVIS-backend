import { qdrant } from "../client/qdrantClient";

console.log("🚀 Running setupCollection...");

export async function setupTodoCollection() {
  const collectionName = "todo_memory";

  const collections = await qdrant.getCollections();
  const exists = collections.collections.find(
    (col) => col.name === collectionName
  );

  if (exists) {
    console.log("✅ Collection already exists.");
    return;
  }

  await qdrant.createCollection(collectionName, {
    vectors: {
      size: 1536,
      distance: "Cosine",
    },
  });

  console.log("🎉 Created collection:", collectionName);
}

setupTodoCollection(); // ← this might be missing
