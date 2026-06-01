import EmptyState from "@/components/shared/EmptyState";

export default async function MindmapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <EmptyState
        icon="🧠"
        title="Mind map coming soon"
        description="AI will extract concepts and relationships from your sources"
      />
    </div>
  );
}
