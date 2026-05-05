import { Router } from "express";
import { calculateCompliance } from "../compliance.js";
import { MaintenanceTaskModel } from "../models/maintenance-task.model.js";
import { SafetyDrillModel } from "../models/safety-drill.model.js";
import { asyncHandler } from "../utils/async-handler.js";

export const complianceRoutes = Router();

complianceRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    const filter = req.query.shipId ? { shipId: req.query.shipId.toString() } : {};
    const [maintenanceDocs, drillDocs] = await Promise.all([
      MaintenanceTaskModel.find(filter),
      SafetyDrillModel.find(filter)
    ]);

    res.json(
      calculateCompliance(
        maintenanceDocs.map((doc) => doc.toJSON()),
        drillDocs.map((doc) => doc.toJSON())
      )
    );
  })
);
