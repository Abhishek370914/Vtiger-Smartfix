import express from "express";
import { handleKnowledgeSearch } from '../controllers/knowledgeController.js';

const router = express.Router();

router.post("/search", handleKnowledgeSearch);

export default router;
