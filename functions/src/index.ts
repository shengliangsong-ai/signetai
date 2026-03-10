// v0.6.0 - Simplified error logging and added second secret for diagnostics.
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import axios from "axios";

const API_VERSION = "0.6.0";
const DEPLOYMENT_TIME = new Date().toISOString();

export const chat = onRequest(
  // Request two secrets. This helps diagnose if the issue is with all secrets or just one.
  { cors: true, secrets: ["GEMINI_API_KEY", "FIREBASE_PROJECT_ID"] },
  async (req, res) => {
    
    // Access secrets from the environment.
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
    const path = req.path;
    const method = req.method;

    // --- ROUTER --- 

    // 1. Health Check Endpoint
    if (path === "/health" || path === "/api/health") {
      if (method === "GET") {
        res.status(200).send({
          status: "ok",
          version: API_VERSION,
          deploymentTime: DEPLOYMENT_TIME,
          note: "Signet API is running and healthy."
        });
      } else {
        res.setHeader("Allow", "GET");
        res.status(405).send({ error: `Method ${method} Not Allowed for this endpoint. Use GET.` });
      }
      return;
    }

    // 2. Chat Endpoint
    if (path === "/chat" || path === "/api/chat") {
      if (method === "POST") {
        // --- Main Chat Logic ---
        try {
          const { contents } = req.body;
          if (!contents) {
            logger.warn("Missing 'contents' in request body");
            res.status(400).send({ error: "Missing 'contents' in request body" });
            return;
          }

          // --- Simplified Secret Check ---
          if (!GEMINI_API_KEY) {
            logger.error("CRITICAL: GEMINI_API_KEY secret is not set in the function's environment.");
            res.status(500).send({ 
              error: "API Key not configured on server",
              debug: { 
                note: "The backend function could not find the required secrets in its environment.",
                GEMINI_API_KEY_found: !!GEMINI_API_KEY,
                FIREBASE_PROJECT_ID_found: !!FIREBASE_PROJECT_ID
              }
            });
            return;
          }

          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
          const requestToGemini = { contents: [{ role: "user", parts: [{ text: contents }] }] };
          const geminiResponse = await axios.post(geminiUrl, requestToGemini, { headers: { "Content-Type": "application/json" } });
          const responseText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from model.";
          
          res.status(200).send({ text: responseText });

        } catch (error: any) {
          logger.error("Chat Function Error:", error.response ? error.response.data : error.message);
          res.status(500).send({ 
            error: "Failed to communicate with the Gemini API", 
            debug: { 
              note: "An error occurred within the Firebase Cloud Function.",
              GEMINI_API_KEY_found: !!GEMINI_API_KEY,
              FIREBASE_PROJECT_ID_found: !!FIREBASE_PROJECT_ID,
              errorDetails: error.response ? error.response.data : { message: error.message }
            }
          });
        }

      } else {
        res.setHeader("Allow", "POST");
        res.status(405).send({ error: `Method ${method} Not Allowed for this endpoint. Use POST.` });
      }
      return;
    }

    // 3. Default 404 Not Found for any other path
    res.status(404).send({ 
      error: "Not Found",
      debug: { 
        note: "The requested path did not match any of the available endpoints.",
        requestedPath: path,
        availableEndpoints: ["/api/chat (POST)", "/api/health (GET)"]
      }
    });
  });
