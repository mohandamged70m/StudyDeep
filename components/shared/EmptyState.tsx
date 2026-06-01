"use client";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <span className="text-4xl">{icon}</span>
      <h3 className="mt-4 font-heading text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[var(--text-secondary)]">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 rounded-[var(--radius)] bg-amber px-5 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
