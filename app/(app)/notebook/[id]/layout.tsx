"use client";

import { usePathname, useRouter } from "next/navigation";
import { PanelLeft, MessageSquare, Plus, PanelRight } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import RightSidebar from "@/components/layout/RightSidebar";
import AddSourceModal from "@/components/sources/AddSourceModal";

export default function NotebookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toggleLeft, toggleRight, showSourceModal, setShowSourceModal } = useUIStore();
  const pathname = usePathname();
  const router = useRouter();

  const id = pathname.match(/\/notebook\/([^/]+)/)?.[1] || "";

  const goToChat = () => {
    router.push(`/notebook/${id}/chat`);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex h-14 items-center justify-between border-b border-[var(--border-color)] bg-white/60 backdrop-blur-md px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLeft}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--cream-3)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
              title="Toggle sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
            <button
              onClick={goToChat}
              className="flex items-center gap-1.5 rounded-[var(--radius)] bg-amber px-4 py-1.5 text-xs font-medium text-white transition-all hover:opacity-90 cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Chat
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToChat}
              className="hidden sm:flex items-center gap-1.5 rounded-[var(--radius)] border border-[var(--border-color)] bg-white px-3.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--cream-3)] cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Ask AI
            </button>
            <button
              onClick={() => setShowSourceModal(true)}
              className="rounded-[var(--radius)] bg-amber px-4 py-1.5 text-xs font-medium text-white transition-all hover:opacity-90 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 inline mr-1" />
              Add Source
            </button>
            <button
              onClick={toggleRight}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--cream-3)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
              title="Toggle tabs"
            >
              <PanelRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>

      <RightSidebar notebookId={id} />
      {showSourceModal && <AddSourceModal notebookId={id} onClose={() => setShowSourceModal(false)} />}
    </div>
  );
}
