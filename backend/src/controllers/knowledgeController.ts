import { Request, Response } from "express";
import { searchKnowledgeBase } from '../services/geminiService.js';

export const handleKnowledgeSearch = async (req: Request, res: Response) => {
  try {
    const { query, context } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const answer = await searchKnowledgeBase(query, context);
    res.json({ answer });
  } catch (error: any) {
    if (error.message && error.message.includes("429")) {
      return res.status(429).json({ error: "Google Gemini API rate limit exceeded. Please wait a minute before trying again." });
    }
    res.status(500).json({ error: error.message });
  }
};
