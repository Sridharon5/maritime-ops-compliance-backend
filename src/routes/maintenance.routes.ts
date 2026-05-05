import { Router } from "express";
import { z } from "zod";
import { requireRole } from "../middleware/require-role.js";
import { MaintenanceTaskModel } from "../models/maintenance-task.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const maintenanceRoutes = Router();

const createSchema = z.object({
  shipId: z.string(),
  title: z.string().min(2),
  description: z.string().min(2),
  assignedCrewId: z.string(),
  dueDate: z.string()
});

const updateSchema = z.object({
  status: z.enum(["Pending", "In Progress", "Completed"]).optional(),
  note: z.string().optional()
});

maintenanceRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    const filter: Record<string, string> = {};
    if (req.query.shipId) filter.shipId = req.query.shipId.toString();
    if (req.query.status) filter.status = req.query.status.toString();
    if (req.query.crewId) filter.assignedCrewId = req.query.crewId.toString();

    res.json(await MaintenanceTaskModel.find(filter).sort({ dueDate: 1 }));
  })
);

maintenanceRoutes.post(
  "/",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const task = await MaintenanceTaskModel.create({
      ...body,
      status: "Pending",
      notes: [],
      createdAt: new Date().toISOString()
    });

    res.status(201).json(task);
  })
);

maintenanceRoutes.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const body = updateSchema.parse(req.body);
    const task = await MaintenanceTaskModel.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (body.status) {
      task.status = body.status;
      task.completedAt = body.status === "Completed" ? new Date().toISOString() : undefined;
    }

    if (body.note?.trim()) task.notes.push(body.note.trim());

    await task.save();
    res.json(task);
  })
);
