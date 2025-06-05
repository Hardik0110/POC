import { Button } from "./Button";
import type { EmptyStateProps } from "../lib/types/types";

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-300 mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="gradient">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}