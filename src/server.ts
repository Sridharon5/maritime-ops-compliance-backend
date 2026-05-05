import cors from "cors";
import "dotenv/config";
import express from "express";
import { z } from "zod";
import { connectDatabase } from "./config/database.js";
import { complianceRoutes } from "./routes/compliance.routes.js";
import { crewRoutes } from "./routes/crew.routes.js";
import { drillRoutes } from "./routes/drill.routes.js";
import { maintenanceRoutes } from "./routes/maintenance.routes.js";
import { shipRoutes } from "./routes/ship.routes.js";
import { seedDatabase } from "./services/seed.service.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
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

async function bootstrap() {
  await connectDatabase();

  if (process.env.SEED_DATABASE === "true") {
    await seedDatabase();
  }

  app.listen(port, () => {
    console.log(`Maritime API running at http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
