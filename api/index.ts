import "dotenv/config";
import type { IncomingMessage, ServerResponse } from "node:http";
import { app } from "../src/app.js";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  return app(req, res);
}
