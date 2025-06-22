const express = require("express");
const {
  insertTodo,
  searchTodo,
  deleteTodo,
  getAllTodos,
  startLongMockTask,
} = require("./controller");

const router = express.Router();

router.post("/add", insertTodo);
router.get("/search", searchTodo);
router.delete("/:id", deleteTodo);
router.get("/all", getAllTodos);
router.post("/mock/longtask", startLongMockTask);

module.exports = router;
