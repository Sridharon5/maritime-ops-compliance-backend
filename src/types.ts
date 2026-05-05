export type Role = "admin" | "crew";

export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type DrillStatus = "Scheduled" | "Completed";

export interface Ship {
  id: string;
  name: string;
  imo: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  shipId: string;
}

export interface MaintenanceTask {
  id: string;
  shipId: string;
  title: string;
  description: string;
  assignedCrewId: string;
  dueDate: string;
  status: TaskStatus;
  notes: string[];
  createdAt: string;
  completedAt?: string;
}

export interface SafetyDrill {
  id: string;
  shipId: string;
  type: string;
  scheduledDate: string;
  assignedCrewIds: string[];
  attendanceCrewIds: string[];
  status: DrillStatus;
  completionNotes?: string;
  completedAt?: string;
}

export interface ComplianceSummary {
  totalMaintenance: number;
  completedMaintenance: number;
  pendingMaintenance: number;
  overdueMaintenance: MaintenanceTask[];
  totalDrillAssignments: number;
  attendedDrillAssignments: number;
  missedDrills: SafetyDrill[];
  maintenanceCompletionPercent: number;
  drillParticipationPercent: number;
  overallCompliancePercent: number;
  status: "Compliant" | "At Risk" | "Non-Compliant";
}
