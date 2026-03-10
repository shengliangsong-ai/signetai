"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = void 0;
// v0.8.0 - Refactor FIREBASE_PROJECT_ID to SIGNET_PROJECT_ID for clarity.
const https_1 = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios_1 = require("axios");
const API_VERSION = "0.8.0";
const DEPLOYMENT_TIME = new Date().toISOString();
exports.chat = (0, https_1.onRequest)(
// Explicitly request the secrets the function needs.
{ cors: true, secrets: ["GEMINI_API_KEY", "SIGNET_PROJECT_ID"] }, async (req, res) => {
    var _a, _b, _c, _d, _e, _f;
    // Access secrets from environment variables.
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const SIGNET_PROJECT_ID = process.env.SIGNET_PROJECT_ID; // Correctly named variable.
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
                projectId: SIGNET_PROJECT_ID, // Also show project ID on health check
                note: "Signet API is running and healthy."
            });
        }
        else {
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
                // --- Improved Secret Check ---
                if (!GEMINI_API_KEY || !SIGNET_PROJECT_ID) {
                    logger.error("CRITICAL: Required secrets are not set in the function's environment.");
                    res.status(500).send({
                        error: "API Key or Project ID not configured on server",
                        debug: {
                            note: "The backend function could not find the required secrets in its environment.",
                            GEMINI_API_KEY_found: !!GEMINI_API_KEY,
                            SIGNET_PROJECT_ID_found: !!SIGNET_PROJECT_ID
                        }
                    });
                    return;
                }
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
                const requestToGemini = { contents: [{ role: "user", parts: [{ text: contents }] }] };
                const geminiResponse = await axios_1.default.post(geminiUrl, requestToGemini, { headers: { "Content-Type": "application/json" } });
                const responseText = ((_f = (_e = (_d = (_c = (_b = (_a = geminiResponse.data) === null || _a === void 0 ? void 0 : _a.candidates) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.parts) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.text) || "No response from model.";
                res.status(200).send({ text: responseText });
            }
            catch (error) {
                logger.error("Chat Function Error:", error.response ? error.response.data : error.message);
                res.status(500).send({
                    error: "Failed to communicate with the Gemini API",
                    debug: {
                        note: "An error occurred within the Firebase Cloud Function.",
                        GEMINI_API_KEY_found: !!GEMINI_API_KEY,
                        SIGNET_PROJECT_ID_found: !!SIGNET_PROJECT_ID,
                        errorDetails: error.response ? error.response.data : { message: error.message }
                    }
                });
            }
        }
        else {
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
//# sourceMappingURL=index.js.map