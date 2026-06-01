"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import SourceCard from "@/components/sources/SourceCard";
import { useSourceStore } from "@/store/sourceStore";
import { useUIStore } from "@/store/uiStore";

export default function SourcesPage() {
  const params = useParams();
  const notebookId = params.id as string;
  const { sources, isLoading, fetchSources, deleteSource } = useSourceStore();
  const { setShowSourceModal } = useUIStore();

  useEffect(() => {
    fetchSources(notebookId);
  }, [notebookId]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-amber" />
      </div>
    );
  }

  if (sources.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon="📄"
          title="Your sources will appear here"
          description="Upload PDFs, paste text, or add YouTube links to get started"
          action={{ label: "Add Source", onClick: () => setShowSourceModal(true) }}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
          Sources
        </h2>
        <button
          onClick={() => setShowSourceModal(true)}
          className="flex items-center gap-1.5 rounded-[var(--radius)] bg-amber px-4 py-2 text-xs font-medium text-white transition-all hover:opacity-90 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Source
        </button>
      </div>
      <div className="space-y-2">
        {sources.map((source) => (
          <SourceCard key={source.id} source={source} onDelete={deleteSource} />
        ))}
      </div>
    </div>
  );
}
