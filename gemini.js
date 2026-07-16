const axios = require("axios");
const config = require("./config");

/* =========================================
   GEMINI API URL
========================================= */

const GEMINI_URL =
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${config.GEMINI_API_KEY}`;
/* =========================================
   DOWNLOAD IMAGE
========================================= */
/* =========================================
   DOWNLOAD IMAGE
========================================= */

async function downloadImage(fileUrl) {

    try {

        const response = await axios.get(fileUrl, {

            responseType: "arraybuffer"

        });

        return Buffer.from(response.data);

    } catch (error) {

        console.log("Image Download Error:", error.message);

        throw new Error("IMAGE_DOWNLOAD_FAILED");

    }

}

/* =========================================
   BUFFER → BASE64
========================================= */

function bufferToBase64(buffer) {

    return buffer.toString("base64");

}

/* =========================================
   CREATE IMAGE PART
========================================= */

function createImagePart(base64Image) {

    return {

        inlineData: {

            mimeType: "image/jpeg",

            data: base64Image

        }

    };

}
const { buildPrompt } = require("./prompts");

/* =========================================
   ANALYZE CHART
========================================= */

async function analyzeChart(fileUrl, market, timeframe) {

    try {

        // Download Telegram Image
        const imageBuffer = await downloadImage(fileUrl);

        // Convert Base64
        const base64Image = bufferToBase64(imageBuffer);

        // Build Prompt
        const prompt = buildPrompt(
            market,
            timeframe
        );

        // Request Body
        const body = {

            contents: [

                {

                    role: "user",

                    parts: [

                        {
                            text: prompt
                        },

                        createImagePart(base64Image)

                    ]

                }

            ],

            generationConfig: {

                temperature: 0.3,

                topP: 0.9,

                topK: 40,

                maxOutputTokens: 1024

            }

        };
       console.log("Sending request...");
console.log("API KEY:", config.GEMINI_API_KEY);
console.log("URL:", GEMINI_URL);

        // Send Request
        const response = await axios.post(

            GEMINI_URL,

            body,

            {

                headers: {

                    "Content-Type": "application/json"

                },

                timeout: 30000

            }

        );

        // Get AI Text
        const aiText =
            response.data
            ?.candidates?.[0]
            ?.content?.parts?.[0]
            ?.text;

        if (!aiText) {

            throw new Error("EMPTY_RESPONSE");

        }

        return aiText;

    } catch (error) {

    console.log("========== GEMINI ERROR ==========");
    console.log("Status:", error.response?.status);
    console.log("Data:", JSON.stringify(error.response?.data, null, 2));
    console.log("Message:", error.message);
    console.log("API KEY:", config.GEMINI_API_KEY);
    console.log("URL:", GEMINI_URL);
    console.log("==================================");

    throw new Error("GEMINI_FAILED");

}
/* =========================================
   PARSE GEMINI RESPONSE
========================================= */

function parseResponse(aiText) {

    try {

        if (!aiText) {
            throw new Error("EMPTY_RESPONSE");
        }

        // Remove Markdown JSON Block
        let cleanText = aiText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const result = JSON.parse(cleanText);

        return {

            signal: result.signal || "NO TRADE",

            confidence: Number(result.confidence) || 0,

            entry: result.entry || "-",

            take_profit: result.take_profit || "-",

            stop_loss: result.stop_loss || "-",

            analysis:
                result.analysis ||
                "বিশ্লেষণ পাওয়া যায়নি।"

        };

    } catch (error) {

        console.log("JSON Parse Error:", error.message);

        return {

            signal: "NO TRADE",

            confidence: 0,

            entry: "-",

            take_profit: "-",

            stop_loss: "-",

            analysis:
                "AI থেকে সঠিক Response পাওয়া যায়নি।"

        };

    }

}

/* =========================================
   MAIN FUNCTION
========================================= */

async function getSignal(fileUrl, market, timeframe) {

    const aiText = await analyzeChart(
        fileUrl,
        market,
        timeframe
    );

    return parseResponse(aiText);

}

/* =========================================
   EXPORTS
========================================= */

module.exports = {

    downloadImage,

    bufferToBase64,

    createImagePart,

    analyzeChart,

    parseResponse,

    getSignal

};
