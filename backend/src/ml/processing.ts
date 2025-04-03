import axios from 'axios';

type GeminiEmbeddingResponse = {
  embedding: {
    values: number[];
  };
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

class GeminiEmbedding {
  private apiKey: string = process.env.GEMINI_API_KEY_0 || "";
  private apiUrl: string = "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-exp-03-07:embedContent";

  async getEmbedding(text: string): Promise<GeminiEmbeddingResponse | null> {
    try {
      const response = await axios.post(
        `${this.apiUrl}?key=${this.apiKey}`,
        {
          model: "models/gemini-embedding-exp-03-07",
          content: {
            parts: [{ text }],
          },
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      return null;
    }
  }
}

function getNextApiKey(): string {
  return process.env.GEMINI_API_KEY_0 || "";
}

async function fetchGeminiResponse(content: string): Promise<string> {
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
}

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/\W+/);
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of',
    'about', 'above', 'after', 'again', 'against', 'all', 'am', 'any', 'are', 'as', 'be', 'because', 
    'been', 'before', 'being', 'below', 'between', 'both', 'can', 'did', 'do', 'does', 'doing', 'down', 
    'during', 'each', 'few', 'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 
    'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'into', 'is', 'it', 'its', 'itself', 
    'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'off', 'once', 'only', 
    'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 
    'such', 'than', 'that', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 
    'this', 'those', 'through', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 
    'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'would', 'you', 'your', 'yours', 'yourself', 
    'yourselves', 'ability', 'able', 'skills', 'job', 'work', 'working', 'position', 'company', 'role', 'responsible',
    'responsibility', 'responsibilities', 'experience', 'year', 'years', 'month', 'months', 'day', 'days',
    'time', 'also', 'include', 'including', 'included', 'etc', 'may', 'must', 'need', 'needed', 'new',
    'well', 'good', 'great', 'strong', 'excellent'
  ]);
  return [...new Set(words)].filter(word => word.length > 2 && !stopWords.has(word) && /^[a-z]+$/.test(word));
}

function findMissingKeywords(jobDesc: string, resumeText: string): string[] {
  const jobKeywords = extractKeywords(jobDesc);
  const resumeKeywords = new Set(extractKeywords(resumeText));
  return jobKeywords.filter(keyword => !resumeKeywords.has(keyword));
}

function generateTips(missingKeywords: string[], jobDesc: string): string[] {
  if (missingKeywords.length === 0) {
    return ["Your resume already contains most keywords from the job description."];
  }
  
  const keywordGroups: { [category: string]: string[] } = {};
  
  missingKeywords.forEach(keyword => {
    if (/javascript|typescript|python|java|go|rust|c\+\+|php|ruby/.test(keyword)) {
      keywordGroups["Programming Languages"] = keywordGroups["Programming Languages"] || [];
      keywordGroups["Programming Languages"].push(keyword);
    } else if (/react|angular|vue|svelte|node|express|django|flask|spring/.test(keyword)) {
      keywordGroups["Frameworks"] = keywordGroups["Frameworks"] || [];
      keywordGroups["Frameworks"].push(keyword);
    } else if (/aws|azure|gcp|cloud|docker|kubernetes|serverless/.test(keyword)) {
      keywordGroups["Cloud & DevOps"] = keywordGroups["Cloud & DevOps"] || [];
      keywordGroups["Cloud & DevOps"].push(keyword);
    } else if (/sql|nosql|mongodb|postgresql|mysql|database|data/.test(keyword)) {
      keywordGroups["Database & Data"] = keywordGroups["Database & Data"] || [];
      keywordGroups["Database & Data"].push(keyword);
    } else if (/lead|manage|team|agile|scrum|communicate/.test(keyword)) {
      keywordGroups["Soft Skills"] = keywordGroups["Soft Skills"] || [];
      keywordGroups["Soft Skills"].push(keyword);
    } else {
      keywordGroups["Other Skills"] = keywordGroups["Other Skills"] || [];
      keywordGroups["Other Skills"].push(keyword);
    }
  });
  
  const tips: string[] = [];
  
  Object.entries(keywordGroups).forEach(([category, keywords]) => {
    if (keywords.length > 0) {
      tips.push(`Consider adding experience with ${category.toLowerCase()}: ${keywords.join(', ')}`);
    }
  });
  
  return tips;
}

export interface ResumeAnalysis {
  similarityScore: number;
  missingKeywords: string[];
  tips: string[];
  aiSuggestions?: string; 
}

export async function analyzeResume(jobDesc: string, resumeText: string): Promise<ResumeAnalysis> {
  const similarityScore = await calculateSimilarity(jobDesc, resumeText);
  const missingKeywords = findMissingKeywords(jobDesc, resumeText);
  const tips = generateTips(missingKeywords, jobDesc);
  
  let aiSuggestions = "";
  if (missingKeywords.length > 0) {
    const prompt = `
      I'm applying for a job and my resume seems to be missing some important keywords.
      
      Job Description Keywords: ${missingKeywords.join(', ')}
      
      Can you provide specific suggestions on how I could incorporate these keywords into my resume naturally?
      Please provide examples of bullet points or phrases I could use for each category of missing skills.
    `;
    
    try {
      aiSuggestions = await fetchGeminiResponse(prompt);
    } catch (error) {
      console.error("Failed to get AI suggestions:", error);
      aiSuggestions = "Unable to generate AI suggestions at this time.";
    }
  } else {
    aiSuggestions = "Your resume already contains the key terms from the job description.";
  }
  
  return {
    similarityScore,
    missingKeywords,
    tips,
    aiSuggestions
  };
}

export async function calculateSimilarity(jobDesc: string, resumeText: string): Promise<number> {
  try {
    const geminiEmbedding = new GeminiEmbedding();
    
    const jobEmbeddingResponse = await geminiEmbedding.getEmbedding(jobDesc);
    const resumeEmbeddingResponse = await geminiEmbedding.getEmbedding(resumeText);

    if (!jobEmbeddingResponse || !resumeEmbeddingResponse) {
      return 0;
    }

    const jobVector = jobEmbeddingResponse.embedding.values || [];
    const resumeVector = resumeEmbeddingResponse.embedding.values || [];
    
    if (jobVector.length === 0 || resumeVector.length === 0 || jobVector.length !== resumeVector.length) {
      return 0;
    }
    
    return Math.round(cosineSimilarity(jobVector, resumeVector) * 100);
  } catch (error) {
    return 0;
  }
}

function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));

  return magnitude1 && magnitude2 ? dotProduct / (magnitude1 * magnitude2) : 0;
}

