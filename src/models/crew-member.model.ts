import { Schema, model } from "mongoose";
import type { CrewMember } from "../types.js";
import { normalizeDocumentJson } from "../utils/mongoose-transform.js";

const crewMemberSchema = new Schema<CrewMember>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    shipId: { type: String, required: true, index: true }
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

export const CrewMemberModel = model<CrewMember>("CrewMember", crewMemberSchema);
