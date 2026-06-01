import EmptyState from "@/components/shared/EmptyState";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <EmptyState
        icon="🤖"
        title="Ask AI about your sources"
        description="Add sources first, then chat with them here"
      />
    </div>
  );
}
