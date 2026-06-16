import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

import authRoutes from './server/routes/auth';
import taskRoutes from './server/routes/task';
import userRoutes from './server/routes/user';
import db from './server/config/db';
import { authenticateToken } from './server/middleware/auth';
import * as aiService from './server/services/aiService';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/user", userRoutes);

// AI Endpoints
app.post("/api/ai/recommend", authenticateToken, async (req: any, res) => {
  try {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id) as any;
    if (!user) return res.status(404).json({ error: "User not found" });
    const recommendation = await aiService.generateCareerRecommendation(user);
    res.json(recommendation);
  } catch (error: any) {
    console.error("AI Recommendation Error:", error);
    res.status(500).json({ error: error.message || "AI Service Unavailable" });
  }
});

app.post("/api/ai/chat", authenticateToken, async (req: any, res) => {
  const { message } = req.body;
  try {
    const reply = await aiService.chatWithMentor(message);
    res.json({ reply });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: error.message || "AI Chat Unavailable" });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
