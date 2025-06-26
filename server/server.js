const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const WebSocket = require("ws"); // Import WebSocket
const http = require("http");
const { setWebSocketServer } = require("./features/todo/controller");

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
// const personalFactsRoutes = require("./features/personalFacts/routes");
app.use("/api/todo", todoRoutes);
// app.use("/api/personal", personalFactsRoutes);

const PORT = 3001;

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server and attach it to the HTTP server
const wss = new WebSocket.Server({ server });

// Pass the WebSocket server instance to your controller
setWebSocketServer(wss);

wss.on("connection", (ws) => {
  console.log("Frontend client connected to WebSocket.");

  ws.on("message", (message) => {
    console.log(`Received message from client: ${message}`);
    // You can handle messages from the client here if needed
  });

  ws.on("close", () => {
    console.log("Frontend client disconnected from WebSocket.");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
  console.log(`WebSocket server also running on ws://localhost:${PORT}`);
});
