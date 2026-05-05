import { Schema, model } from "mongoose";
import type { SafetyDrill } from "../types.js";
import { normalizeDocumentJson } from "../utils/mongoose-transform.js";

const safetyDrillSchema = new Schema<SafetyDrill>(
  {
    shipId: { type: String, required: true, index: true },
    type: { type: String, required: true, trim: true },
    scheduledDate: { type: String, required: true, index: true },
    assignedCrewIds: { type: [String], required: true, default: [] },
    attendanceCrewIds: { type: [String], required: true, default: [] },
    status: {
      type: String,
      enum: ["Scheduled", "Completed"],
      default: "Scheduled",
      required: true
    },
    completionNotes: { type: String },
    completedAt: { type: String }
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

safetyDrillSchema.index({ shipId: 1, scheduledDate: 1 });

export const SafetyDrillModel = model<SafetyDrill>("SafetyDrill", safetyDrillSchema);
