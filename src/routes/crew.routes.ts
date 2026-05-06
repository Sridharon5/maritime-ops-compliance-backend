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
    const page = Number(req.query.page ?? 0);
    const limit = Number(req.query.limit ?? 0);
    const hasPagination = Number.isFinite(page) && Number.isFinite(limit) && page > 0 && limit > 0;

    const filter = req.query.shipId ? { shipId: req.query.shipId.toString() } : {};

    if (!hasPagination) {
      res.json(await CrewMemberModel.find(filter).sort({ name: 1 }));
      return;
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      CrewMemberModel.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
      CrewMemberModel.countDocuments(filter)
    ]);

    res.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit))
    });
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
