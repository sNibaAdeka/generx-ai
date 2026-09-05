import type { RiskLevel } from "./api/mockData";

export function riskTone(
  level: RiskLevel,
): "low" | "moderate" | "elevated" | "high" {
  return level.toLowerCase() as "low" | "moderate" | "elevated" | "high";
}

export function confidenceDots(confidence: number): number {
  return Math.max(0, Math.min(10, Math.round(confidence / 10)));
}
