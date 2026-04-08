import express from "express";
import { handleAnalyzeTicket, handlePostComment, handleAssignTicket } from "../controllers/ticketController";

const router = express.Router();

router.post("/analyze", handleAnalyzeTicket);
router.post("/post-comment", handlePostComment);
router.post("/assign", handleAssignTicket);

export default router;
