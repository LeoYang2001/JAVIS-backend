const { QdrantClient } = require("@qdrant/js-client-rest");
const client = new QdrantClient({ url: "http://localhost:6333" });

async function insertTodoToQdrant(id, content, payload) {
  const vector = await embedText(content);
  await client.upsert("todo_memory", {
    wait: true,
    points: [
      {
        id,
        vector,
        payload,
      },
    ],
  });
}

async function searchTodoInQdrant(query) {
  const vector = await embedText(query);
  const result = await client.search("todo_memory", {
    vector,
    limit: 5,
    with_payload: true,
  });
  return result;
}

async function deleteTodoFromQdrant(id) {
  await client.delete("todo_memory", { points: [id] });
}

const searchAllTodos = async () => {
  const response = await client.scroll("todo_memory", {
    limit: 1000,
    with_payload: true,
  });

  return response.points.map((point) => ({
    content: point.payload.content,
    sqlId: point.payload.sqlId,
  }));
};

module.exports = {
  insertTodoToQdrant,
  searchTodoInQdrant,
  deleteTodoFromQdrant,
  searchAllTodos,
};
