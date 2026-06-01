"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, LogOut, MoreHorizontal, PanelLeftClose, PanelLeft } from "lucide-react";
import { useNotebookStore } from "@/store/notebookStore";
import { useUIStore } from "@/store/uiStore";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import CreateNotebookModal from "@/components/notebooks/CreateNotebookModal";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { notebooks, isLoading, fetchNotebooks } = useNotebookStore();
  const { leftOpen, toggleLeft } = useUIStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchNotebooks();
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.name) setUserName(user.user_metadata.name);
    });
  }, []);

  const activeId = pathname.match(/\/notebook\/([^/]+)/)?.[1];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <aside
        className={cn(
          "flex flex-col border-r border-[var(--border-color)] bg-[var(--bg-sidebar)] transition-all duration-300",
          leftOpen ? "w-60" : "w-[60px]"
        )}
      >
        {/* Logo + toggle */}
        <div className="flex h-14 items-center justify-between border-b border-[var(--border-color)] px-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber text-white font-heading font-semibold text-sm">
              S
            </div>
            <span
              className={cn(
                "font-heading text-sm font-semibold text-[var(--text-primary)] transition-opacity",
                leftOpen ? "opacity-100" : "w-0 opacity-0 overflow-hidden"
              )}
            >
              StudyDeep
            </span>
          </div>
          <button
            onClick={toggleLeft}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--cream-3)] transition-all cursor-pointer"
            title={leftOpen ? "Close sidebar" : "Open sidebar"}
          >
            {leftOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Notebook list */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <div
            className={cn(
              "mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]",
              !leftOpen && "text-center px-0"
            )}
          >
            {leftOpen ? "Notebooks" : "N"}
          </div>

          {isLoading ? (
            <div className="space-y-1 px-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-9 animate-pulse rounded-[var(--radius)] bg-[var(--cream-3)]" />
              ))}
            </div>
          ) : notebooks.length === 0 ? (
            leftOpen && <div className="px-2 text-xs text-[var(--text-muted)]">No notebooks yet</div>
          ) : (
            <div className="space-y-0.5">
              {notebooks.map((nb) => {
                const isActive = nb.id === activeId;
                return (
                  <div key={nb.id} className="group relative">
                    <Link
                      href={`/notebook/${nb.id}/sources`}
                      className={cn(
                        "flex items-center gap-2 rounded-[var(--radius)] px-3 py-2 text-sm transition-all",
                        isActive
                          ? "bg-amber-light text-amber font-medium"
                          : "text-[var(--text-secondary)] hover:bg-[var(--cream-3)]",
                        !leftOpen && "justify-center px-2"
                      )}
                      title={!leftOpen ? nb.title : undefined}
                    >
                      <span className="shrink-0">{nb.emoji}</span>
                      {leftOpen && (
                        <>
                          <span className="flex-1 truncate">{nb.title}</span>
                          <span className="text-[10px] text-[var(--text-muted)]">{nb.source_count ?? 0}</span>
                        </>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* New notebook button */}
        <div className="px-2 pb-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-[var(--radius)] border-2 border-dashed border-[var(--border-color)] bg-white/50 text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-amber hover:text-amber cursor-pointer",
              leftOpen ? "py-2" : "py-2.5"
            )}
            title="New Notebook"
          >
            <Plus className="h-3.5 w-3.5 shrink-0" />
          </button>
        </div>

        {/* Footer */}
        {leftOpen && (
          <div className="flex items-center justify-between border-t border-[var(--border-color)] px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--cream-3)] text-[10px] font-medium text-[var(--text-secondary)]">
                {userName.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="truncate max-w-[100px]">{userName || "User"}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex h-7 w-7 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--cream-3)] hover:text-coral transition-all cursor-pointer"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </aside>

      {showCreateModal && <CreateNotebookModal onClose={() => setShowCreateModal(false)} />}
    </>
  );
}
