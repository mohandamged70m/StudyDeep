import EmptyState from "@/components/shared/EmptyState";

export default async function SummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <EmptyState
        icon="📋"
        title="Smart summary coming soon"
        description="AI will summarize all your sources into key concepts and exam questions"
      />
    </div>
  );
}
