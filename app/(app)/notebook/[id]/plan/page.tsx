import EmptyState from "@/components/shared/EmptyState";

export default async function PlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <EmptyState
        icon="📅"
        title="Study plan coming soon"
        description="Tell us your exam date and available hours for a personalized plan"
      />
    </div>
  );
}
