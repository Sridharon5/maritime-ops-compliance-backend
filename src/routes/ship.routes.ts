import { Router } from "express";
import { z } from "zod";
import { requireRole } from "../middleware/require-role.js";
import { ShipModel } from "../models/ship.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const shipRoutes = Router();

const createSchema = z.object({
  name: z.string().min(2),
  imo: z.string().min(4)
});

shipRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page ?? 0);
    const limit = Number(req.query.limit ?? 0);
    const hasPagination = Number.isFinite(page) && Number.isFinite(limit) && page > 0 && limit > 0;

    if (!hasPagination) {
      res.json(await ShipModel.find().sort({ name: 1 }));
      return;
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      ShipModel.find().sort({ name: 1 }).skip(skip).limit(limit),
      ShipModel.countDocuments({})
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

shipRoutes.post(
  "/",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const ship = await ShipModel.create(body);

    res.status(201).json(ship);
  })
);
