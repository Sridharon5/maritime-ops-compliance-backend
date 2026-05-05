import { Schema, model } from "mongoose";
import type { Ship } from "../types.js";
import { normalizeDocumentJson } from "../utils/mongoose-transform.js";

const shipSchema = new Schema<Ship>(
  {
    name: { type: String, required: true, trim: true },
    imo: { type: String, required: true, trim: true, unique: true }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => normalizeDocumentJson(ret)
    }
  }
);

export const ShipModel = model<Ship>("Ship", shipSchema);
