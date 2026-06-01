"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelRightClose, PanelRight } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "sources", label: "Sources", icon: "📄" },
  { id: "flashcards", label: "Flashcards", icon: "🃏" },
  { id: "mindmap", label: "Mind Map", icon: "🧠" },
  { id: "summary", label: "Summary", icon: "📋" },
  { id: "plan", label: "Study Plan", icon: "📅" },
];

interface RightSidebarProps {
  notebookId: string;
}

export default function RightSidebar({ notebookId }: RightSidebarProps) {
  const pathname = usePathname();
  const { rightOpen, toggleRight } = useUIStore();
  const activeTab = pathname.split("/").pop() || "sources";

  return (
    <aside
      className={cn(
        "flex flex-col border-l border-[var(--border-color)] bg-[var(--bg-sidebar)] transition-all duration-300",
        rightOpen ? "w-52" : "w-[52px]"
      )}
    >
      {/* Header + toggle */}
      <div className="flex h-14 items-center justify-between border-b border-[var(--border-color)] px-3">
        {rightOpen && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Tabs
          </span>
        )}
        <button
          onClick={toggleRight}
          className="flex h-7 w-7 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--cream-3)] transition-all cursor-pointer"
          title={rightOpen ? "Close tabs" : "Open tabs"}
        >
          {rightOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Tab links */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <div className="space-y-0.5">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={`/notebook/${notebookId}/${tab.id}`}
                className={cn(
                  "flex items-center gap-2.5 rounded-[var(--radius)] px-3 py-2.5 text-sm transition-all",
                  isActive
                    ? "bg-amber-light text-amber font-medium"
                    : "text-[var(--text-secondary)] hover:bg-[var(--cream-3)]",
                  !rightOpen && "justify-center px-2"
                )}
                title={!rightOpen ? tab.label : undefined}
              >
                <span className="shrink-0 text-base">{tab.icon}</span>
                {rightOpen && <span className="truncate">{tab.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
