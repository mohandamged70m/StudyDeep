"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useNotebookStore } from "@/store/notebookStore";

const COLORS = ["#D4891A", "#1A7A6A", "#C94F2C", "#5B4FBF", "#2E7D50", "#2563EB", "#B45309", "#831843"];
const EMOJIS = ["📚", "🔬", "🧮", "⚗️", "📖", "🌍", "💻", "🧬", "📐", "🎨", "🏛️", "🔭"];

interface Props {
  onClose: () => void;
}

export default function CreateNotebookModal({ onClose }: Props) {
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("📚");
  const [color, setColor] = useState(COLORS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const createNotebook = useNotebookStore((s) => s.createNotebook);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsLoading(true);
    await createNotebook({ title: title.trim(), emoji, color });
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-[var(--text-primary)]">New Notebook</h2>
          <button onClick={onClose} className="rounded p-1 text-[var(--text-muted)] hover:bg-[var(--cream-2)] cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">Notebook name</label>
            <input
              type="text"
              placeholder="e.g. Biology 201"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-[var(--radius)] border border-[var(--border-color)] bg-white px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-amber/30 focus:border-amber"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Emoji</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius)] text-lg transition-all cursor-pointer ${
                    emoji === e ? "bg-amber-light ring-2 ring-amber" : "border border-[var(--border-color)] hover:bg-[var(--cream-2)]"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-all cursor-pointer ${
                    color === c ? "ring-2 ring-amber ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-[var(--radius)] border border-[var(--border-color)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-all hover:bg-[var(--cream-2)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-[var(--radius)] bg-amber px-4 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-60 cursor-pointer"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Notebook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
