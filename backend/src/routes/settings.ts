import express from "express";
import { handleTestConnection } from '../controllers/settingsController.js';

const router = express.Router();

router.post("/test-vtiger-connection", handleTestConnection);

export default router;
