import express from "express";
import { handleRunHealthCheck } from "../controllers/healthController";

const router = express.Router();

router.post("/", handleRunHealthCheck);

export default router;
