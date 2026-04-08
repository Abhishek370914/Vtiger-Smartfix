import { Request, Response } from "express";
import { VtigerService } from '../services/vtigerService.js';

export const handleTestConnection = async (req: Request, res: Response) => {
  try {
    const { url, username, accessKey } = req.body;
    if (!url || !username || !accessKey) {
      return res.status(400).json({ error: "URL, Username, and Access Key are required" });
    }

    const vtiger = new VtigerService(url, username, accessKey);
    await vtiger.login();
    res.json({ success: true, message: "Connection successful" });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
