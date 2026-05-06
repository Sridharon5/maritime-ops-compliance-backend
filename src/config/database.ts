import mongoose from "mongoose";

/** Default when `MONGODB_URI` is unset in non-production (matches `.env.example`). */
const DEFAULT_LOCAL_URI = "mongodb://127.0.0.1:27017/maritime_ops_compliance";

function resolveMongoUri(): string {
  const explicit = process.env.MONGODB_URI?.trim();
  if (explicit) return explicit;

  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    return "";
  }

  /** Optional override for local Docker / custom host (see `backend/.env.example`). */
  const localOverride = process.env.LOCAL_MONGODB_URI?.trim();
  return localOverride || DEFAULT_LOCAL_URI;
}

export async function connectDatabase() {
  const mongoUri = resolveMongoUri();

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI is required in production. For local development, omit MONGODB_URI to use LOCAL_MONGODB_URI or the default localhost URI, or set MONGODB_URI in backend/.env."
    );
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);

  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
