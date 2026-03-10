import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import axios from "axios";

// Get the Gemini API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const chat = onRequest(
  { cors: true }, // Automatically handle CORS
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    try {
      const { contents } = req.body;
      if (!contents) {
        logger.warn("Missing 'contents' in request body");
        res.status(400).send({ error: "Missing 'contents' in request body" });
        return;
      }

      if (!GEMINI_API_KEY) {
        logger.error("GEMINI_API_KEY is not set in environment variables.");
        res.status(500).send({ error: "API Key not configured on server" });
        return;
      }

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

      const geminiResponse = await axios.post(
        geminiUrl,
        {
          contents: [{ role: "user", parts: [{ text: contents }] }],
          systemInstruction: {
            role: "system",
            parts: [{ text: "Signet-Alpha AI Support. Spec v0.4.0. Authority: signetai.io:ssl." }]
          }
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const responseText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Neural link timeout.";

      res.status(200).send({ text: responseText });

    } catch (error: any) {
      logger.error("Chat Proxy Error:", error.response ? error.response.data : error.message);
      res.status(500).send({ error: "Failed to communicate with Gemini API" });
    }
  });
