// server/features/personalFacts/controller.js
const model = require("./model");

async function insertPersonalFact(req, res) {
  const { owner, key, value } = req.body;
  try {
    const fact = await model.insertFact(owner, key, value);
    res.json({ success: true, data: fact });
  } catch (err) {
    console.error("Insert failed:", err);
    res.status(500).json({ success: false });
  }
}

async function getAllPersonalFacts(req, res) {
  try {
    const facts = await model.getAllFacts();
    res.json(facts);
  } catch (err) {
    console.error("Fetch all failed:", err);
    res.status(500).json({ success: false });
  }
}

async function deletePersonalFact(req, res) {
  const id = parseInt(req.params.id);
  try {
    await model.deleteFactById(id);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ success: false });
  }
}

async function updatePersonalFact(req, res) {
  const { owner, key, value } = req.body;
  try {
    const updated = await model.updateFactByKey(owner, key, value);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ success: false });
  }
}

module.exports = {
  insertPersonalFact,
  getAllPersonalFacts,
  deletePersonalFact,
  updatePersonalFact,
};
