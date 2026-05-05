import { Router } from "express";
import { z } from "zod";
import { requireRole } from "../middleware/require-role.js";
import { CrewMemberModel } from "../models/crew-member.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const crewRoutes = Router();

const createSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  shipId: z.string().min(1)
});

crewRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    const filter = req.query.shipId ? { shipId: req.query.shipId.toString() } : {};
    res.json(await CrewMemberModel.find(filter).sort({ name: 1 }));
  })
);

crewRoutes.post(
  "/",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const crewMember = await CrewMemberModel.create(body);

    res.status(201).json(crewMember);
  })
);
