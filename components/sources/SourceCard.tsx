"use client";

import { FileText, Video, AlignLeft, Trash2, Clock } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { Source } from "@/types";

interface SourceCardProps {
  source: Source;
  onDelete: (id: string) => void;
}

const TYPE_CONFIG = {
  pdf: { icon: FileText, color: "text-coral bg-coral-light" },
  text: { icon: AlignLeft, color: "text-violet bg-violet-light" },
  youtube: { icon: Video, color: "text-teal bg-teal-light" },
};

export default function SourceCard({ source, onDelete }: SourceCardProps) {
  const config = TYPE_CONFIG[source.type];
  const Icon = config.icon;
  const meta = source.metadata as Record<string, unknown> | null;
  const wordCount = Number(meta?.word_count) || 0;
  const pages = Number(meta?.pages) || 0;

  return (
    <div className="group flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3.5 transition-all hover:shadow-sm">
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", config.color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-[var(--text-primary)] truncate">{source.title}</h4>
        <div className="mt-0.5 flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
          <span className="capitalize">{source.type}</span>
          {!!wordCount && <span>{wordCount} words</span>}
          {!!pages && <span>{pages} pages</span>}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(source.created_at)}
          </span>
        </div>
      </div>
      <button
        onClick={() => onDelete(source.id)}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-[var(--text-muted)] opacity-0 group-hover:opacity-100 hover:bg-coral-light hover:text-coral transition-all cursor-pointer"
        title="Delete source"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
