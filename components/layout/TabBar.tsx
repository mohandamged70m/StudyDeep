"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "sources", label: "Sources", icon: "📄" },
  { id: "chat", label: "Ask AI", icon: "🤖" },
  { id: "flashcards", label: "Flashcards", icon: "🃏" },
  { id: "mindmap", label: "Mind Map", icon: "🧠" },
  { id: "summary", label: "Summary", icon: "📋" },
  { id: "plan", label: "Study Plan", icon: "📅" },
];

interface TabBarProps {
  notebookId: string;
}

export default function TabBar({ notebookId }: TabBarProps) {
  const pathname = usePathname();
  const activeTab = pathname.split("/").pop() || "sources";

  return (
    <div className="flex items-center gap-1">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Link
            key={tab.id}
            href={`/notebook/${notebookId}/${tab.id}`}
            className={cn(
              "flex items-center gap-1.5 rounded-[var(--radius)] px-3.5 py-2 text-xs font-medium transition-all",
              isActive
                ? "bg-white text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-muted)] hover:bg-[var(--cream-3)]"
            )}
          >
            <span className="text-sm">{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
