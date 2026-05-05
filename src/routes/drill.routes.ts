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
    const filter: Record<string, string | { $in: string[] }> = {};
    if (req.query.shipId) filter.shipId = req.query.shipId.toString();
    if (req.query.crewId) filter.assignedCrewIds = { $in: [req.query.crewId.toString()] };

    res.json(await SafetyDrillModel.find(filter).sort({ scheduledDate: 1 }));
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
