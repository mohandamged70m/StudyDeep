import Sidebar from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-page)]">
      <Sidebar />
      <div className="flex flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
