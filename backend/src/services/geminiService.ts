import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const analyzeTicket = async (ticketData: any) => {
  const prompt = `
You are an AI assistant for Vtiger CRM support.

Analyze the following support ticket and generate a structured response.

Ticket:
${JSON.stringify(ticketData, null, 2)}

Tasks:
1. Classify as SIMPLE or COMPLEX.
2. Suggest best team: Support, Developer, QA, Billing, or Other.
3. Extract key details.
4. If SIMPLE: Provide clear step-by-step solution for customer.
5. If COMPLEX: Generate a professional structured internal escalation email exactly in this format:

Subject: <Short title>

Hi Team,

Issue Summary:
<1-2 lines>

Details:
- Problem:
- Observed Behavior:
- Possible Cause (if any):

Suggested Actions:
- Step 1
- Step 2

Priority: Low/Medium/High

Regards,  
Support Team via SmartFix

Return output strictly in JSON format:
{
  "type": "SIMPLE" or "COMPLEX",
  "suggested_team": "Developer" or "QA" etc.,
  "priority": "High/Medium/Low",
  "solution": "step-by-step text for simple",
  "escalation_email": "full email text for complex",
  "confidence": number 0-100
}
  `;

  const responseSchema = {
    type: SchemaType.OBJECT,
    properties: {
      type: { type: SchemaType.STRING, description: "Classification: SIMPLE or COMPLEX" },
      suggested_team: { type: SchemaType.STRING, description: "Suggested team: Developer, QA, Billing, Support, Other" },
      priority: { type: SchemaType.STRING, description: "High/Medium/Low" },
      solution: { type: SchemaType.STRING, description: "Step by step text for simple. Keep short but informative." },
      escalation_email: { type: SchemaType.STRING, description: "Full email text for complex." },
      confidence: { type: SchemaType.NUMBER, description: "0-100" }
    },
    required: ["type", "suggested_team", "priority", "solution", "escalation_email", "confidence"]
  } as Schema;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    }
  });

  return JSON.parse(result.response.text());
};

export const searchKnowledgeBase = async (query: string, context?: any) => {
  const prompt = `
    As a Vtiger SmartFix assistant, answer the following user query based on Vtiger best practices and common CRM issues.
    Query: ${query}
    ${context ? `Context: ${JSON.stringify(context)}` : ""}
    
    Provide a direct answer, steps to resolve if applicable, and mention official sources if known.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};
