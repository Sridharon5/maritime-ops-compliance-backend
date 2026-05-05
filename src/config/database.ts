import mongoose from "mongoose";

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/maritime_ops_compliance";

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);

  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
