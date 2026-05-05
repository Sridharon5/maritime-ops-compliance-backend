import "dotenv/config";
import { app } from "../src/app.js";
import { connectDatabase } from "../src/config/database.js";

let databaseConnection: Promise<void> | undefined;

export default async function handler(req: unknown, res: unknown) {
  databaseConnection ??= connectDatabase();
  await databaseConnection;

  return app(req, res);
}
