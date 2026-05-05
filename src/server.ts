import "dotenv/config";
import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { seedDatabase } from "./services/seed.service.js";

const port = Number(process.env.PORT ?? 4000);

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
