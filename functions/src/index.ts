// Triggering a fresh deployment to resolve potential live environment issues.
// This comment is added to trigger a new GitHub Actions workflow run.
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_VERSION = "0.5.1"; // Version of the API
const DEPLOYMENT_TIME = new Date().toISOString(); // Records the time of initialization

// Pricing for gemini-1.5-flash-latest in USD as of June 2024
const INPUT_PRICE_PER_MILLION_TOKENS = 0.35;
const OUTPUT_PRICE_PER_MILLION_TOKENS = 1.05;

export const chat = onRequest(
  { cors: true },
  async (req, res) => {

    // --- Health & Version Check Endpoint ---
    if (req.path === "/health" || req.path === "/api/health") {
      res.status(200).send({
        status: "ok",
        version: API_VERSION,
        deploymentTime: DEPLOYMENT_TIME,
        note: "Signet API is running and healthy."
      });
      return;
    }

    // --- Chat Endpoint ---
    if (req.path !== "/chat" && req.path !== "/api/chat") {
        res.status(404).send({ 
          error: "Not Found",
          debug: { 
            note: "The requested path did not match any of the available endpoints.",
            requestedPath: req.path,
            availableEndpoints: ["/api/chat", "/api/health"]
          }
        });
        return;
    }

    if (req.method !== "POST") {
      res.status(405).send({ error: "Method Not Allowed for this endpoint." });
      return;
    }
    
    // --- Comprehensive Environment Variable Health Check ---
    const envVarsToCheck = [
        'API_KEY',
        'FIREBASE_API_KEY',
        'FIREBASE_APP_ID',
        'FIREBASE_AUTH_DOMAIN',
        'FIREBASE_MEASUREMENT_ID',
        'FIREBASE_MESSAGING_SENDER_ID',
        'FIREBASE_PROJECT_ID',
        'FIREBASE_SERVICE_ACCOUNT_SIGNETAI',
        'FIREBASE_STORAGE_BUCKET',
        'GEMINI_API_KEY',
        'GEMINI_LIVE_API_KEY',
        'GOOGLE_GEMINI_KEY',
        'GOOGLE_OAUTH_CLIENT_ID',
        'VITE_GOOGLE_CLIENT_ID',
        'VITE_GOOGLE_GEMINI_KEY',
        'YOUTUBE_API_KEY'
    ];

    const environmentVariableHealth: { [key: string]: { found: boolean; value: string; } } = {};
    for (const key of envVarsToCheck) {
        const value = process.env[key];
        environmentVariableHealth[key] = {
            found: !!value,
            value: value ? `...${value.slice(-4)}` : "Not Set"
        };
    }

    try {
      const { contents } = req.body;
      if (!contents) {
        logger.warn("Missing 'contents' in request body");
        res.status(400).send({ error: "Missing 'contents' in request body" });
        return;
      }

      if (!GEMINI_API_KEY) {
        logger.error("CRITICAL: GEMINI_API_KEY is not set in the function's environment variables.");
        res.status(500).send({ 
          error: "API Key not configured on server",
          debug: {
            note: "The backend function could not find the GEMINI_API_KEY in its environment. This must be set in the Google Cloud project.",
            keyFound: false,
            environmentVariableHealth: environmentVariableHealth
          }
        });
        return;
      }

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

      const systemInstruction = {
        role: "system",
        parts: [{ text: "Signet-Alpha AI Support. Spec v0.4.0. Authority: signetai.io:ssl." }]
      };

      const requestToGemini = {
        contents: [{ role: "user", parts: [{ text: contents }] }],
        systemInstruction: systemInstruction
      };

      const geminiResponse = await axios.post(
        geminiUrl,
        requestToGemini,
        { headers: { "Content-Type": "application/json" } }
      );

      const responseText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Neural link timeout.";

      // --- Enhanced Debug Information ---
      const usageMetadata = geminiResponse.data?.usageMetadata || {};
      const inputTokens = usageMetadata.promptTokenCount || 0;
      const outputTokens = usageMetadata.candidatesTokenCount || 0;
      const totalTokens = usageMetadata.totalTokenCount || 0;

      const calculateCost = (input: number, output: number) => {
        const inputCost = (input / 1_000_000) * INPUT_PRICE_PER_MILLION_TOKENS;
        const outputCost = (output / 1_000_000) * OUTPUT_PRICE_PER_MILLION_TOKENS;
        return inputCost + outputCost;
      };

      const estimatedCost = calculateCost(inputTokens, outputTokens);

      const debugInfo = {
        note: "This is a transparent, end-to-end trace of the data sent to and received from the Gemini API via the Firebase Cloud Function proxy.",
        serverEnvironment: {
          requestPath: req.path,
          firebaseFunction: "chat",
          region: process.env.FUNCTION_REGION || "us-central1",
          serverApiKeyUsed: `...${GEMINI_API_KEY.slice(-5)}`,
          version: API_VERSION,
          deploymentTime: DEPLOYMENT_TIME
        },
        environmentVariableHealth: environmentVariableHealth,
        requestToGemini: {
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`,
          parameters: requestToGemini,
        },
        responseFromGemini: geminiResponse.data,
        usageAndCost: {
          inputTokens: inputTokens,
          outputTokens: outputTokens,
          totalTokens: totalTokens,
          estimatedCostUSD: `$${estimatedCost.toFixed(8)}`,
          pricingModel: {
            model: "gemini-1.5-flash-latest",
            inputCostPerMillionTokens: `$${INPUT_PRICE_PER_MILLION_TOKENS}`,
            outputCostPerMillionTokens: `$${OUTPUT_PRICE_PER_MILLION_TOKENS}`,
          }
        }
      };

      res.status(200).send({ text: responseText, debug: debugInfo });

    } catch (error: any) {
      logger.error("Chat Function Error:", error.response ? error.response.data : error.message);
      const errorResponse = error.response ? error.response.data : { message: error.message };
      res.status(500).send({ 
        error: "Failed to communicate with the Gemini API", 
        debug: { 
          note: "An error occurred within the Firebase Cloud Function while trying to contact the Gemini API.",
          serverApiKeyUsed: `...${GEMINI_API_KEY ? GEMINI_API_KEY.slice(-5) : 'NONE'}`,
          environmentVariableHealth: environmentVariableHealth,
          errorDetails: errorResponse
        }
      });
    }
  });
