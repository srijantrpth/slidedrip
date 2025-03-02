import fetch from 'node-fetch';

const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const generateWithGemini = async (text, type, retryCount = 0) => {
    try {
        const prompt = type === "Questions" 
            ? `Create 25 tricky Viva Questions from the topics covered in given ${text} You do not need to be strictly restricted to the text you can create your own programming or logical questions as well but strictly defined from the topics in the text `
            : `Provide a nice academic from: ${text} make sure you cover everything as it is for the final exams`;

        const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        // If service is unavailable, retry
        if (response.status === 503 && retryCount < MAX_RETRIES) {
            await sleep(RETRY_DELAY * (retryCount + 1));
            return generateWithGemini(text, type, retryCount + 1);
        }

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error("Invalid response format from Gemini API");
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        if (retryCount < MAX_RETRIES) {
            await sleep(RETRY_DELAY * (retryCount + 1));
            return generateWithGemini(text, type, retryCount + 1);
        }
        throw new Error(`Gemini API Error: ${error.message}`);
    }
};