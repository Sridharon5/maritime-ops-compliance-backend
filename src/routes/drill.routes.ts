import { Router } from "express";
import { z } from "zod";
import { requireRole } from "../middleware/require-role.js";
import { SafetyDrillModel } from "../models/safety-drill.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const drillRoutes = Router();

const createSchema = z.object({
  shipId: z.string(),
  type: z.string().min(2),
  scheduledDate: z.string(),
  assignedCrewIds: z.array(z.string()).min(1)
});

drillRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page ?? 0);
    const limit = Number(req.query.limit ?? 0);
    const hasPagination = Number.isFinite(page) && Number.isFinite(limit) && page > 0 && limit > 0;

    const filter: Record<string, unknown> = {};
    if (req.query.shipId) filter.shipId = req.query.shipId.toString();
    if (req.query.crewId) filter.assignedCrewIds = { $in: [req.query.crewId.toString()] };
    if (req.query.status) filter.status = req.query.status.toString();

    const scheduledDate: Record<string, string> = {};
    if (req.query.scheduledFrom) scheduledDate.$gte = req.query.scheduledFrom.toString();
    if (req.query.scheduledTo) scheduledDate.$lte = req.query.scheduledTo.toString();
    if (Object.keys(scheduledDate).length > 0) filter.scheduledDate = scheduledDate;

    if (!hasPagination) {
      res.json(await SafetyDrillModel.find(filter).sort({ scheduledDate: 1 }));
      return;
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      SafetyDrillModel.find(filter).sort({ scheduledDate: 1 }).skip(skip).limit(limit),
      SafetyDrillModel.countDocuments(filter)
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

drillRoutes.post(
  "/",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const drill = await SafetyDrillModel.create({
      ...body,
      attendanceCrewIds: [],
      status: "Scheduled"
    });

    res.status(201).json(drill);
  })
);

drillRoutes.post(
  "/:id/attendance",
  asyncHandler(async (req, res) => {
    const { crewId } = z.object({ crewId: z.string() }).parse(req.body);
    const drill = await SafetyDrillModel.findById(req.params.id);

    if (!drill) return res.status(404).json({ message: "Drill not found" });
    if (!drill.assignedCrewIds.includes(crewId)) {
      return res.status(400).json({ message: "Crew member is not assigned to this drill" });
    }

    if (!drill.attendanceCrewIds.includes(crewId)) drill.attendanceCrewIds.push(crewId);

    await drill.save();
    res.json(drill);
  })
);

drillRoutes.patch(
  "/:id/complete",
  asyncHandler(async (req, res) => {
    const drill = await SafetyDrillModel.findById(req.params.id);
    if (!drill) return res.status(404).json({ message: "Drill not found" });

    const { notes } = z.object({ notes: z.string().optional() }).parse(req.body);
    drill.status = "Completed";
    drill.completedAt = new Date().toISOString();
    drill.completionNotes = notes;

    await drill.save();
    res.json(drill);
  })
);
