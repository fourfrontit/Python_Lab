import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      })
    : null;

  // API endpoints
  app.post("/api/chat", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: "Gemini API key is not configured for this server." });
      }

      const { contents, systemInstruction } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Chat error:", err);
      res.status(500).json({ error: err.message || "Failed to call chat engine" });
    }
  });

  app.post("/api/tts", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: "Gemini API key is not configured for this server." });
      }

      const { text, voiceName = "Kore" } = req.body;
      
      // Sanitize text and truncate to fit preview limits comfortably
      const cleanText = text.substring(0, 400);

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: `Read clearly: ${cleanText}` }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        return res.status(404).json({ error: "No voice audio was generated." });
      }

      res.json({ audio: base64Audio });
    } catch (err: any) {
      console.error("TTS error:", err);
      res.status(500).json({ error: err.message || "Failed to generate AI speech" });
    }
  });

  // Serve static files in development via Vite, and via express.static in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
