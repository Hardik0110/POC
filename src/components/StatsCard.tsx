import type { StatsCardProps } from "../lib/types/types";

export function StatsCard({ value, label, color }: StatsCardProps) {
  const colorClass = {
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400',
    green: 'text-green-400'
  }[color];

  return (
    <div className="stats-card">
      <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
      <div className="text-slate-300 text-sm">{label}</div>
    </div>
  );
}