"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useNotebookStore } from "@/store/notebookStore";
import { formatDate } from "@/lib/utils";
import type { Notebook } from "@/types";

interface Props {
  notebook: Notebook;
}

export default function NotebookCard({ notebook }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const deleteNotebook = useNotebookStore((s) => s.deleteNotebook);

  return (
    <Link
      href={`/notebook/${notebook.id}/sources`}
      className="group relative block rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-white transition-all hover:shadow-md"
      style={{ borderTopColor: notebook.color, borderTopWidth: 4 }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <span className="text-2xl">{notebook.emoji}</span>
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(!menuOpen);
              }}
              className="flex h-7 w-7 items-center justify-center rounded text-[var(--text-muted)] opacity-0 transition-all hover:bg-[var(--cream-2)] group-hover:opacity-100 cursor-pointer"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute left-0 top-8 z-20 w-36 rounded-[var(--radius)] border border-[var(--border-color)] bg-white py-1 shadow-md">
                  <button
                    onClick={(e) => { e.preventDefault(); setMenuOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--cream-2)] cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Rename
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      deleteNotebook(notebook.id);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-coral hover:bg-coral-light cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <h3 className="mt-3 font-heading text-base font-semibold text-[var(--text-primary)]">
          {notebook.title}
        </h3>

        <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-muted)]">
          <span>{notebook.source_count ?? 0} sources</span>
          {notebook.updated_at && (
            <>
              <span>&middot;</span>
              <span>{formatDate(notebook.updated_at)}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
