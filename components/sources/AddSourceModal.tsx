"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Video, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSourceStore } from "@/store/sourceStore";

type Tab = "pdf" | "text" | "youtube";

interface AddSourceModalProps {
  notebookId: string;
  onClose: () => void;
}

const TABS: { id: Tab; label: string; icon: typeof Upload }[] = [
  { id: "pdf", label: "Upload PDF", icon: Upload },
  { id: "text", label: "Paste Text", icon: FileText },
  { id: "youtube", label: "YouTube Link", icon: Video },
];

export default function AddSourceModal({ notebookId, onClose }: AddSourceModalProps) {
  const [tab, setTab] = useState<Tab>("pdf");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { addSource } = useSourceStore();

  const canSubmit = () => {
    if (!title.trim()) return false;
    if (tab === "pdf" && !file) return false;
    if (tab === "text" && !content.trim()) return false;
    if (tab === "youtube" && !url.trim()) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!canSubmit()) return;
    setIsSubmitting(true);
    await addSource(notebookId, {
      type: tab,
      title: title.trim(),
      content: tab === "text" ? content : undefined,
      file: tab === "pdf" ? file ?? undefined : undefined,
      url: tab === "youtube" ? url.trim() : undefined,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[var(--radius-lg)] bg-[var(--bg-card)] shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] px-5 py-4">
          <h2 className="font-heading text-base font-semibold text-[var(--text-primary)]">Add Source</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--cream-3)] transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border-color)] px-5 pt-3">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-medium transition-all cursor-pointer",
                  isActive
                    ? "border-amber text-amber"
                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="space-y-4 px-5 py-4">
          {/* Title */}
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)]">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 3 Notes"
              className="mt-1 w-full rounded-[var(--radius)] border border-[var(--border-color)] bg-white px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-amber transition-colors"
            />
          </div>

          {/* Tab content */}
          {tab === "pdf" && (
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">File</label>
              <div
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "mt-1 flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius)] border-2 border-dashed px-4 py-8 transition-colors",
                  file ? "border-amber bg-amber-light/30" : "border-[var(--border-color)] hover:border-amber/50"
                )}
              >
                <Upload className="h-6 w-6 text-[var(--text-muted)]" />
                {file ? (
                  <span className="text-sm text-[var(--text-primary)]">{file.name}</span>
                ) : (
                  <>
                    <span className="text-sm font-medium text-[var(--text-secondary)]">Click to upload PDF</span>
                    <span className="text-[11px] text-[var(--text-muted)]">PDF files only</span>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </div>
          )}

          {tab === "text" && (
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your study material here..."
                rows={8}
                className="mt-1 w-full resize-none rounded-[var(--radius)] border border-[var(--border-color)] bg-white px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-amber transition-colors"
              />
            </div>
          )}

          {tab === "youtube" && (
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">YouTube URL</label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="mt-1 w-full rounded-[var(--radius)] border border-[var(--border-color)] bg-white px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-amber transition-colors"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[var(--border-color)] px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-[var(--radius)] px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--cream-3)] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit() || isSubmitting}
            className="flex items-center gap-1.5 rounded-[var(--radius)] bg-amber px-4 py-2 text-xs font-medium text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isSubmitting ? "Adding..." : "Add Source"}
          </button>
        </div>
      </div>
    </div>
  );
}
