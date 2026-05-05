import type { ComplianceSummary, MaintenanceTask, SafetyDrill } from "./types.js";

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const isBeforeToday = (date: string) => new Date(date) < startOfToday();

const percent = (value: number, total: number) => {
  if (total === 0) return 100;
  return Math.round((value / total) * 100);
};

export function calculateCompliance(
  maintenanceTasks: MaintenanceTask[],
  safetyDrills: SafetyDrill[]
): ComplianceSummary {
  const completedMaintenance = maintenanceTasks.filter((task) => task.status === "Completed").length;
  const overdueMaintenance = maintenanceTasks.filter(
    (task) => task.status !== "Completed" && isBeforeToday(task.dueDate)
  );

  const totalDrillAssignments = safetyDrills.reduce(
    (sum, drill) => sum + drill.assignedCrewIds.length,
    0
  );
  const attendedDrillAssignments = safetyDrills.reduce(
    (sum, drill) => sum + drill.attendanceCrewIds.length,
    0
  );
  const missedDrills = safetyDrills.filter(
    (drill) =>
      isBeforeToday(drill.scheduledDate) &&
      (drill.status !== "Completed" || drill.attendanceCrewIds.length < drill.assignedCrewIds.length)
  );

  const maintenanceCompletionPercent = percent(completedMaintenance, maintenanceTasks.length);
  const drillParticipationPercent = percent(attendedDrillAssignments, totalDrillAssignments);
  const overallCompliancePercent = Math.round(
    (maintenanceCompletionPercent + drillParticipationPercent) / 2
  );

  const status =
    overdueMaintenance.length > 0 || missedDrills.length > 0
      ? "Non-Compliant"
      : overallCompliancePercent < 85
        ? "At Risk"
        : "Compliant";

  return {
    totalMaintenance: maintenanceTasks.length,
    completedMaintenance,
    pendingMaintenance: maintenanceTasks.length - completedMaintenance,
    overdueMaintenance,
    totalDrillAssignments,
    attendedDrillAssignments,
    missedDrills,
    maintenanceCompletionPercent,
    drillParticipationPercent,
    overallCompliancePercent,
    status
  };
}
