// server/features/personalFacts/model.js
const db = require("../../db");
const { client } = require("@qdrant/js-client-rest");
const { embedText } = require("../utils/embedText");

async function insertFact(owner, key, value) {
  const result = await db.query(
    `INSERT INTO personal_facts (owner, key, value)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [owner, key, value]
  );

  const sentence = `${owner}'s ${key} is ${value}`;
  const vector = await embedText(sentence);

  await client.upsert("personal_facts", [
    {
      id: result.rows[0].id,
      vector,
      payload: { owner, key, value },
    },
  ]);

  return result.rows[0];
}

async function getAllFacts() {
  const result = await db.query(`SELECT * FROM personal_facts`);
  return result.rows;
}

async function searchFactsByQuery(query) {
    const vector = await embedText(query);

    const result = await client.search("personal_facts", {
      vector,
      limit: 5,
      with_payload: true,
    });
}

async function deleteFactById(id) {
  await db.query(`DELETE FROM personal_facts WHERE id = $1`, [id]);
  await client.delete("personal_facts", [id]);
}

async function updateFactByKey(owner, key, value) {
  const result = await db.query(
    `UPDATE personal_facts SET value = $1, created_at = NOW()
     WHERE owner = $2 AND key = $3 RETURNING *`,
    [value, owner, key]
  );

  const sentence = `${owner}'s ${key} is ${value}`;
  const vector = await embedText(sentence);

  await client.upsert("personal_facts", [
    {
      id: result.rows[0].id,
      vector,
      payload: { owner, key, value },
    },
  ]);

  return result.rows[0];
}

module.exports = {
  insertFact,
  getAllFacts,
  searchFactsByOwner,
  deleteFactById,
  updateFactByKey,
};
