import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import ticketRoutes from "./routes/ticket";
import healthRoutes from "./routes/health";
import knowledgeRoutes from "./routes/knowledge";
import settingsRoutes from "./routes/settings";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/ticket", ticketRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Vtiger SmartFix Backend listening at http://localhost:${port}`);
});
