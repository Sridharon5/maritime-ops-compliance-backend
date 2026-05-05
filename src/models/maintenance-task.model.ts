import { Schema, model } from "mongoose";
import type { MaintenanceTask } from "../types.js";
import { normalizeDocumentJson } from "../utils/mongoose-transform.js";

const maintenanceTaskSchema = new Schema<MaintenanceTask>(
  {
    shipId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    assignedCrewId: { type: String, required: true, index: true },
    dueDate: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
      required: true
    },
    notes: { type: [String], default: [] },
    createdAt: { type: String, required: true },
    completedAt: { type: String }
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => normalizeDocumentJson(ret)
    }
  }
);

maintenanceTaskSchema.index({ shipId: 1, status: 1, dueDate: 1 });

export const MaintenanceTaskModel = model<MaintenanceTask>("MaintenanceTask", maintenanceTaskSchema);
