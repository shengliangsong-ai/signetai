"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios_1 = require("axios");
// Get the Gemini API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
exports.chat = (0, https_1.onRequest)({ cors: true }, // Automatically handle CORS
async (req, res) => {
    var _a, _b, _c, _d, _e, _f;
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
        const geminiResponse = await axios_1.default.post(geminiUrl, {
            contents: [{ role: "user", parts: [{ text: contents }] }],
            systemInstruction: {
                role: "system",
                parts: [{ text: "Signet-Alpha AI Support. Spec v0.4.0. Authority: signetai.io:ssl." }]
            }
        }, { headers: { "Content-Type": "application/json" } });
        const responseText = ((_f = (_e = (_d = (_c = (_b = (_a = geminiResponse.data) === null || _a === void 0 ? void 0 : _a.candidates) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.parts) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.text) || "Neural link timeout.";
        res.status(200).send({ text: responseText });
    }
    catch (error) {
        logger.error("Chat Proxy Error:", error.response ? error.response.data : error.message);
        res.status(500).send({ error: "Failed to communicate with Gemini API" });
    }
});
//# sourceMappingURL=index.js.map