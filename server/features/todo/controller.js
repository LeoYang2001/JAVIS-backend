const {
  insertTodoToQdrant,
  searchTodoInQdrant,
  deleteTodoFromQdrant,
  searchAllTodos,
} = require("./model");
const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function insertTodo(req, res) {
  const { content, sqlId } = req.body;
  try {
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: content,
    });

    const vector = embeddingRes.data[0].embedding;
    await insertTodoToQdrant(sqlId, vector, { content, sqlId });

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Insert error:", err);
    res.status(500).json({ error: "Failed to insert todo" });
  }
}

async function searchTodo(req, res) {
  const { query } = req.query;
  try {
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    const vector = embeddingRes.data[0].embedding;
    const results = await searchTodoInQdrant(vector);

    const todos = results.map(({ payload, score }) => ({
      ...payload,
      score,
    }));

    res.json(todos);
  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).json({ error: "Failed to search todos" });
  }
}

async function deleteTodo(req, res) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  try {
    await deleteTodoFromQdrant(id);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
}

const getAllTodos = async (req, res) => {
  console.log("searching all todos");
  try {
    const results = await searchAllTodos(); // you'll implement this in model.js
    res.json(results);
  } catch (err) {
    console.error("Failed to fetch all todos:", err);
    res.status(500).json({ error: "Failed to fetch all todos" });
  }
};

const startLongMockTask = (req, res) => {
  console.log("Backend: Starting long mock task...");

  // Send an immediate response to the client
  res.json({ status: "Task started in background." });

  // Simulate a 10-second delay
  setTimeout(() => {
    console.log("Backend: Long mock task completed after 10 seconds.");
    // In a real application, you might send a webhook back to the agent
    // or update a status that the agent can poll.
  }, 100000); // 10 seconds
};

module.exports = {
  insertTodo,
  searchTodo,
  deleteTodo,
  getAllTodos,
  startLongMockTask,
};
