// server/features/personalFacts/routes.js
const express = require("express");
const {
  insertPersonalFact,
  getAllPersonalFacts,
  deletePersonalFact,
  updatePersonalFact,
} = require("./controller");
const router = express.Router();

router.post("/add", insertPersonalFact);
router.get("/all", getAllPersonalFacts);
router.delete("/:id", deletePersonalFact);
router.put("/update", updatePersonalFactus);

module.exports = router;
