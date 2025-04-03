const apiKeys: string[] = [
    process.env.GEMINI_API_KEY_0!,
    process.env.GEMINI_API_KEY_1!,
    process.env.GEMINI_API_KEY_2!,
    process.env.GEMINI_API_KEY_3!,
    process.env.GEMINI_API_KEY_4!,
    process.env.GEMINI_API_KEY_5!,
    process.env.GEMINI_API_KEY_6!
].filter(Boolean);

let apiKeyIndex: number = 0;

const getNextApiKey = (): string => {
    if (apiKeys.length === 0) {
        throw new Error("No API keys available.");
    }
    const key = apiKeys[apiKeyIndex];
    apiKeyIndex = (apiKeyIndex + 1) % apiKeys.length;
    return key;
};

interface GeminiResponse {
    candidates?: { content?: { parts?: { text: string }[] } }[];
}

const fetchGeminiResponse = async (content: string): Promise<string> => {
    const apiKey = getNextApiKey();
    
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const requestBody = {
        contents: [{ parts: [{ text: content }] }]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonResponse = (await response.json()) as GeminiResponse;
        return jsonResponse.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
};

const fetchGeminiExitResponse = async(content : string) : Promise<string> => {
    const apiKey = getNextApiKey();
    
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const requestBody = {
        contents: [{ parts: [{ text: content }] }]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonResponse = (await response.json()) as GeminiResponse;
        return jsonResponse.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
    return "s" ;
} 


const geminiLatexCode = async (content: string): Promise<string> => fetchGeminiResponse(content);
const geminiResumeFormatter = async (content: string): Promise<string> => fetchGeminiResponse(content);

export default { geminiResumeFormatter, geminiLatexCode, fetchGeminiExitResponse };
