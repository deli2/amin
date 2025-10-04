
import { GoogleGenAI } from "@google/genai";

const MAX_RETRIES = 1; // As requested: "یک بار دیگرتلاش کند" means 1 initial try + 1 retry.

// This check is to prevent errors in environments where process.env is not defined.
const apiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY
  ? process.env.API_KEY
  : undefined;

if (!apiKey) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

export const fetchArticleContent = async (url: string): Promise<string> => {
    if(!apiKey) {
        throw new Error("کلید API برای Gemini تنظیم نشده است.");
    }
  
    const prompt = `متن کامل و اصلی مقاله را از آدرس اینترنتی زیر استخراج کن. منوهای ناوبری، تبلیغات، فوتر و سایر موارد غیرمرتبط را حذف کن. فقط متن خام مقاله را ارائه بده. آدرس: ${url}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 0 } // For faster response
            }
        });
        
        const text = response.text;
        if (!text || text.trim().length < 50) { // Basic check for meaningful content
            throw new Error("محتوای معناداری از صفحه استخراج نشد.");
        }
        return text.trim();
    } catch (error) {
        console.error(`Error fetching content for ${url}:`, error);
        throw new Error("ارتباط با سرویس هوش مصنوعی ناموفق بود.");
    }
};

export const fetchArticleContentWithRetry = async (url: string): Promise<string> => {
    let lastError: Error | null = null;
    for (let i = 0; i <= MAX_RETRIES; i++) {
        try {
            return await fetchArticleContent(url);
        } catch (error: any) {
            lastError = error;
            if (i < MAX_RETRIES) {
                console.log(`Retrying (${i + 1}/${MAX_RETRIES}) for ${url}...`);
                // Optional: add a small delay before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
    throw lastError || new Error(`پس از ${MAX_RETRIES + 1} تلاش، دریافت محتوا ناموفق بود.`);
};
