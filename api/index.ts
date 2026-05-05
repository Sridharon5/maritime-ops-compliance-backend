import "dotenv/config";
import type { IncomingMessage, ServerResponse } from "node:http";
import { app } from "../src/app.js";
import { connectDatabase } from "../src/config/database.js";

let databaseConnection: Promise<void> | undefined;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  databaseConnection ??= connectDatabase();
  await databaseConnection;

  return app(req, res);
}
