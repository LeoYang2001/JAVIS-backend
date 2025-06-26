import { qdrant } from "../client/qdrantClient";

async function setupPersonalFactsCollection() {
  const collectionName = "personal_facts";

  const exists = await qdrant.getCollections();
  const found = exists.collections?.some((c) => c.name === collectionName);
  if (found) {
    console.log("✅ Collection already exists.");
    return;
  }

  await qdrant.createCollection(collectionName, {
    vectors: {
      size: 1536, // Or 3072 for gpt-4o embedding
      distance: "Cosine",
    },
  });

  console.log("✅ Created 'personal_facts' collection");
}

setupPersonalFactsCollection();
