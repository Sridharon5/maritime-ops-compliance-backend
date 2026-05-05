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
  asyncHandler(async (_req, res) => {
    res.json(await ShipModel.find().sort({ name: 1 }));
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
