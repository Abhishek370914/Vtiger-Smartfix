import express from "express";
import { handleRunHealthCheck } from '../controllers/healthController.js';

const router = express.Router();

router.post("/", handleRunHealthCheck);

export default router;
