const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/session", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2025-06-03",
        }),
      }
    );

    const data = await response.json();

    if (!data.client_secret?.value) {
      throw new Error("No client_secret returned");
    }

    res.json({ clientSecret: data.client_secret.value });
  } catch (err) {
    console.error("Failed to create session:", err.message);
    res.status(500).json({ error: "Failed to generate client secret" });
  }
});

const todoRoutes = require("./features/todo/routes");
app.use("/api/todo", todoRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Express server running at http://localhost:${PORT}`);
});
