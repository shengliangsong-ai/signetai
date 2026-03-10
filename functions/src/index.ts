import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import axios from "axios";

// Get the Gemini API key from environment variables.
// This is set in the GCP environment, not via .env files for security.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const api = onRequest(
  { cors: true }, // Automatically handle CORS for all responses
  async (req, res) => {
    // The path from the firebase rewrite will be `/api/chat`, not `/chat`.
    if (req.path !== "/api/chat") {
        res.status(404).send("Not Found");
        return;
    }

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
        logger.error("GEMINI_API_KEY is not set in the function's environment variables.");
        res.status(500).send({ error: "API Key not configured on server" });
        return;
      }

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

      const requestToGemini = {
        contents: [{ role: "user", parts: [{ text: contents }] }],
        systemInstruction: {
          role: "system",
          parts: [{ text: "Signet-Alpha AI Support. Spec v0.4.0. Authority: signetai.io:ssl." }]
        }
      };

      const geminiResponse = await axios.post(
        geminiUrl,
        requestToGemini,
        { headers: { "Content-Type": "application/json" } }
      );

      const responseText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Neural link timeout.";

      // Create a debug object to send back to the client
      const debugInfo = {
        note: "This is the data sent to and received from the Gemini API via the Firebase Cloud Function proxy.",
        requestToGemini: requestToGemini,
        responseFromGemini: geminiResponse.data
      };

      // Send both the response text and the debug information
      res.status(200).send({ text: responseText, debug: debugInfo });

    } catch (error: any) {
      logger.error("Chat Function Error:", error.response ? error.response.data : error.message);
      const errorResponse = error.response ? error.response.data : { message: error.message };
      res.status(500).send({ 
        error: "Failed to communicate with the Gemini API", 
        debug: { 
          note: "An error occurred in the Firebase Cloud Function.",
          error: errorResponse
        }
      });
    }
  });
