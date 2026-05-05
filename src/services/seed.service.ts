import { CrewMemberModel } from "../models/crew-member.model.js";
import { MaintenanceTaskModel } from "../models/maintenance-task.model.js";
import { SafetyDrillModel } from "../models/safety-drill.model.js";
import { ShipModel } from "../models/ship.model.js";

export async function seedDatabase() {
  const shipCount = await ShipModel.countDocuments();
  if (shipCount > 0) return;

  const [horizon, pacific] = await ShipModel.create([
    { name: "MV Horizon", imo: "IMO9283142" },
    { name: "MV Pacific Star", imo: "IMO8214451" }
  ]);

  const [asha, daniel, meera, omar] = await CrewMemberModel.create([
    { name: "Asha Rao", role: "Chief Engineer", shipId: horizon.id },
    { name: "Daniel Kim", role: "Deck Officer", shipId: horizon.id },
    { name: "Meera Singh", role: "Safety Officer", shipId: pacific.id },
    { name: "Omar Ali", role: "Marine Engineer", shipId: pacific.id }
  ]);

  await MaintenanceTaskModel.create([
    {
      shipId: horizon.id,
      title: "Inspect lifeboat davits",
      description: "Check hydraulic lines and release gear.",
      assignedCrewId: asha.id,
      dueDate: "2026-05-02",
      status: "In Progress",
      notes: ["Hydraulic oil level checked."],
      createdAt: "2026-04-25T09:00:00.000Z"
    },
    {
      shipId: horizon.id,
      title: "Service fire pump",
      description: "Run pressure test and record readings.",
      assignedCrewId: daniel.id,
      dueDate: "2026-05-12",
      status: "Pending",
      notes: [],
      createdAt: "2026-04-28T09:00:00.000Z"
    },
    {
      shipId: pacific.id,
      title: "Main engine cooling inspection",
      description: "Inspect cooling water strainers.",
      assignedCrewId: omar.id,
      dueDate: "2026-04-30",
      status: "Completed",
      notes: ["Completed with no defects."],
      createdAt: "2026-04-22T09:00:00.000Z",
      completedAt: "2026-04-29T15:30:00.000Z"
    }
  ]);

  await SafetyDrillModel.create([
    {
      shipId: horizon.id,
      type: "Fire Drill",
      scheduledDate: "2026-05-01",
      assignedCrewIds: [asha.id, daniel.id],
      attendanceCrewIds: [asha.id],
      status: "Scheduled"
    },
    {
      shipId: pacific.id,
      type: "Evacuation Drill",
      scheduledDate: "2026-05-10",
      assignedCrewIds: [meera.id, omar.id],
      attendanceCrewIds: [],
      status: "Scheduled"
    }
  ]);

  console.log("MongoDB seed data inserted.");
}
