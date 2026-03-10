"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = void 0;
// v0.5.3 - Restored full debug output and corrected routing
const https_1 = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios_1 = require("axios");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_VERSION = "0.5.3"; // Version of the API
const DEPLOYMENT_TIME = new Date().toISOString(); // Records the time of initialization
// Pricing for gemini-1.5-flash-latest in USD as of June 2024
const INPUT_PRICE_PER_MILLION_TOKENS = 0.35;
const OUTPUT_PRICE_PER_MILLION_TOKENS = 1.05;
// --- Comprehensive Environment Variable Health Check ---
const getEnvironmentVariableHealth = () => {
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
    const health = {};
    for (const key of envVarsToCheck) {
        const value = process.env[key];
        health[key] = {
            found: !!value,
            value: value ? `...${value.slice(-4)}` : "Not Set"
        };
    }
    return health;
};
exports.chat = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g;
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
                if (!GEMINI_API_KEY) {
                    logger.error("CRITICAL: GEMINI_API_KEY is not set.");
                    res.status(500).send({
                        error: "API Key not configured on server",
                        debug: {
                            note: "The backend function could not find the GEMINI_API_KEY in its environment.",
                            keyFound: false,
                            environmentVariableHealth: getEnvironmentVariableHealth()
                        }
                    });
                    return;
                }
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
                const requestToGemini = { contents: [{ role: "user", parts: [{ text: contents }] }] };
                const geminiResponse = await axios_1.default.post(geminiUrl, requestToGemini, { headers: { "Content-Type": "application/json" } });
                const responseText = ((_f = (_e = (_d = (_c = (_b = (_a = geminiResponse.data) === null || _a === void 0 ? void 0 : _a.candidates) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.parts) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.text) || "Neural link timeout.";
                const usageMetadata = ((_g = geminiResponse.data) === null || _g === void 0 ? void 0 : _g.usageMetadata) || {};
                const inputTokens = usageMetadata.promptTokenCount || 0;
                const outputTokens = usageMetadata.candidatesTokenCount || 0;
                const totalTokens = usageMetadata.totalTokenCount || 0;
                const calculateCost = (input, output) => ((input / 1000000) * INPUT_PRICE_PER_MILLION_TOKENS) + ((output / 1000000) * OUTPUT_PRICE_PER_MILLION_TOKENS);
                const estimatedCost = calculateCost(inputTokens, outputTokens);
                const debugInfo = {
                    note: "This is a transparent, end-to-end trace of the data sent to and received from the Gemini API via the Firebase Cloud Function proxy.",
                    serverEnvironment: { firebaseFunction: "chat", region: process.env.FUNCTION_REGION || "us-central1", serverApiKeyUsed: `...${GEMINI_API_KEY.slice(-5)}`, version: API_VERSION, deploymentTime: DEPLOYMENT_TIME },
                    environmentVariableHealth: getEnvironmentVariableHealth(),
                    requestToGemini: { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`, parameters: requestToGemini, },
                    responseFromGemini: geminiResponse.data,
                    usageAndCost: { inputTokens, outputTokens, totalTokens, estimatedCostUSD: `$${estimatedCost.toFixed(8)}`, pricingModel: { model: "gemini-1.5-flash-latest", inputCostPerMillionTokens: `$${INPUT_PRICE_PER_MILLION_TOKENS}`, outputCostPerMillionTokens: `$${OUTPUT_PRICE_PER_MILLION_TOKENS}`, } }
                };
                res.status(200).send({ text: responseText, debug: debugInfo });
            }
            catch (error) {
                logger.error("Chat Function Error:", error.response ? error.response.data : error.message);
                const errorResponse = error.response ? error.response.data : { message: error.message };
                res.status(500).send({
                    error: "Failed to communicate with the Gemini API",
                    debug: {
                        note: "An error occurred within the Firebase Cloud Function while trying to contact the Gemini API.",
                        serverApiKeyUsed: `...${GEMINI_API_KEY ? GEMINI_API_KEY.slice(-5) : 'NONE'}`,
                        environmentVariableHealth: getEnvironmentVariableHealth(),
                        errorDetails: errorResponse
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