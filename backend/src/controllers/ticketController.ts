import { Request, Response } from "express";
import { analyzeTicket } from '../services/geminiService.js';
import { VtigerService } from '../services/vtigerService.js';

export const handleAnalyzeTicket = async (req: Request, res: Response) => {
  try {
    const { ticketData } = req.body;
    if (!ticketData) {
      return res.status(400).json({ error: "Ticket data is required" });
    }

    const analysis = await analyzeTicket(ticketData);
    res.json({ analysis });
  } catch (error: any) {
    console.error("Analysis Error:", error);
    if (error.message && error.message.includes("429")) {
      return res.status(429).json({ error: "Google Gemini API rate limit exceeded. Please wait a minute before trying again." });
    }
    res.status(500).json({ error: error.message });
  }
};

export const handlePostComment = async (req: Request, res: Response) => {
  try {
    const { url, username, accessKey, ticketId, comment } = req.body;
    if (!url || !username || !accessKey || !ticketId || !comment) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const vtiger = new VtigerService(url, username, accessKey);
    const result = await vtiger.addComment(ticketId, comment);
    
    if (result.success) {
      res.json({ success: true, result: result.result });
    } else {
      res.status(400).json({ error: result.error?.message || "Failed to post comment" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const handleAssignTicket = async (req: Request, res: Response) => {
  try {
    const { url, username, accessKey, ticketId, userId } = req.body;
    if (!url || !username || !accessKey || !ticketId || !userId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const vtiger = new VtigerService(url, username, accessKey);
    const result = await vtiger.assignTicket(ticketId, userId);
    
    if (result.success) {
      res.json({ success: true, result: result.result });
    } else {
      res.status(400).json({ error: result.error?.message || "Failed to assign ticket" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
