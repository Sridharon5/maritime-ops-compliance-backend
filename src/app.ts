import cors from "cors";
import express from "express";
import { z } from "zod";
import { complianceRoutes } from "./routes/compliance.routes.js";
import { crewRoutes } from "./routes/crew.routes.js";
import { drillRoutes } from "./routes/drill.routes.js";
import { maintenanceRoutes } from "./routes/maintenance.routes.js";
import { shipRoutes } from "./routes/ship.routes.js";
import { connectDatabase } from "./config/database.js";

export const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-user-role"]
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

let databaseConnection: Promise<void> | undefined;

app.use("/api", async (_req, _res, next) => {
  try {
    databaseConnection ??= connectDatabase();
    await databaseConnection;
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/ships", shipRoutes);
app.use("/api/crew", crewRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/drills", drillRoutes);
app.use("/api/compliance", complianceRoutes);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof z.ZodError) return res.status(400).json({ message: error.issues });
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
