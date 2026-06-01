"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNotebookStore } from "@/store/notebookStore";
import NotebookCard from "@/components/notebooks/NotebookCard";
import CreateNotebookModal from "@/components/notebooks/CreateNotebookModal";
import EmptyState from "@/components/shared/EmptyState";
import { createClient } from "@/lib/supabase/client";
import { pluralize } from "@/lib/utils";

export default function NotebooksPage() {
  const { notebooks, isLoading, fetchNotebooks } = useNotebookStore();
  const [userName, setUserName] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchNotebooks();
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.name) setUserName(user.user_metadata.name);
    });
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Hero */}
        <div>
          <h1 className="font-heading text-3xl font-semibold text-[var(--text-primary)]">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}
            {userName ? `, ${userName}` : ""} 👋
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">What are you studying today?</p>
        </div>

        {/* Stats */}
        {notebooks.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { label: "Total Notebooks", value: notebooks.length },
              { label: "Total Sources", value: notebooks.reduce((a, b) => a + (b.source_count ?? 0), 0) },
              { label: "Cards Reviewed Today", value: 0 },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-white p-4"
              >
                <div className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</div>
                <div className="mt-0.5 text-xs text-[var(--text-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Notebook grid */}
        {isLoading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-[var(--radius-lg)] bg-[var(--cream-3)]" />
            ))}
          </div>
        ) : notebooks.length > 0 ? (
          <div className="mt-8">
            <h2 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
              Your Notebooks
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notebooks.map((nb) => (
                <NotebookCard key={nb.id} notebook={nb} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-12">
            <EmptyState
              icon="📭"
              title="No notebooks yet"
              description="Create your first notebook to start studying"
              action={{ label: "Create notebook", onClick: () => setShowCreate(true) }}
            />
          </div>
        )}
      </div>

      {/* FAB */}
      {notebooks.length > 0 && (
        <button
          onClick={() => setShowCreate(true)}
          className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-amber text-white shadow-lg transition-all hover:opacity-90 cursor-pointer z-40"
        >
          <Plus className="h-5 w-5" />
        </button>
      )}

      {showCreate && <CreateNotebookModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
