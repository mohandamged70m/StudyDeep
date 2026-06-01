import EmptyState from "@/components/shared/EmptyState";

export default async function FlashcardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <EmptyState
        icon="🃏"
        title="Flashcards coming soon"
        description="AI will generate flashcards from your sources automatically"
      />
    </div>
  );
}
