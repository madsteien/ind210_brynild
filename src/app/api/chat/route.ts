import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import faqData from '@/data/faq.json';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cache for FAQ embeddings
let faqEmbeddings: { id: string; embedding: number[]; question: string; answer: string }[] | null = null;

// Function to compute cosine similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Function to get embeddings for a text
async function getEmbedding(text: string, customClient?: OpenAI): Promise<number[]> {
  const client = customClient || openai;
  const response = await client.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return response.data[0].embedding;
}

// Initialize FAQ embeddings if not already done
async function initializeFaqEmbeddings() {
  if (faqEmbeddings === null) {
    faqEmbeddings = await Promise.all(
      faqData.map(async (faq) => {
        const embedding = await getEmbedding(faq.question + " " + faq.answer);
        return {
          id: faq.id,
          embedding,
          question: faq.question,
          answer: faq.answer,
        };
      })
    );
  }
  return faqEmbeddings;
}

// Function to find similar FAQs based on query embedding
async function findSimilarFaqs(queryEmbedding: number[], count: number = 2) {
  const embeddings = await initializeFaqEmbeddings();
  
  // Compute similarities
  const similarities = embeddings.map(faq => ({
    ...faq,
    similarity: cosineSimilarity(queryEmbedding, faq.embedding)
  }));
  
  // Sort by similarity (descending)
  similarities.sort((a, b) => b.similarity - a.similarity);
  
  // Return top matches
  return similarities.slice(0, count);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, apiKey } = body;

    if (!message) {
      return NextResponse.json({ error: "Meldingen mangler" }, { status: 400 });
    }

    // Use provided API key if available, otherwise use environment variable
    const openaiClient = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });

    // Get embedding for user query (using the instance with possibly custom API key)
    const response = await openaiClient.embeddings.create({
      model: "text-embedding-ada-002",
      input: message,
    });
    const queryEmbedding = response.data[0].embedding;
    
    // Find similar FAQs
    const similarFaqs = await findSimilarFaqs(queryEmbedding);
    
    // Create context from similar FAQs
    const context = similarFaqs
      .map(faq => `Spørsmål: ${faq.question}\nSvar: ${faq.answer}`)
      .join("\n\n");    // Generate chat completion with context
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Du er en hjelpsom kundestøtte-chatbot for en nettbutikk som selger godteri. Besvar spørsmål på norsk.
          
Her er relevant informasjon som kan hjelpe deg å svare på spørsmålet:
${context}`
        },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseContent = chatCompletion.choices[0].message.content;
    
    return NextResponse.json({ response: responseContent });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Det oppstod en feil ved behandling av forespørselen" },
      { status: 500 }
    );
  }
}
