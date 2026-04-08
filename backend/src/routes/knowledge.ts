import express from "express";
import { handleKnowledgeSearch } from "../controllers/knowledgeController";

const router = express.Router();

router.post("/search", handleKnowledgeSearch);

export default router;
