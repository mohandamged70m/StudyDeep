import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left — decorative panel */}
      <div className="hidden flex-1 flex-col justify-between bg-[var(--cream-2)] p-12 lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber text-white font-heading font-semibold text-lg">
            S
          </div>
          <span className="font-heading text-lg font-semibold text-[var(--text-primary)]">
            StudyDeep
          </span>
        </Link>

        <div className="max-w-md">
          <p className="font-heading text-3xl font-semibold leading-snug text-[var(--text-primary)]">
            &ldquo;Your notes. Your sources. Your understanding.&rdquo;
          </p>
          <div className="mt-8 space-y-4">
            {[
              { icon: "📄", text: "Upload PDFs, paste notes, or add YouTube links" },
              { icon: "🤖", text: "Chat with AI that cites your sources" },
              { icon: "🃏", text: "Auto-generated flashcards with spaced repetition" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 rounded-[var(--radius)] bg-white/60 px-4 py-3 text-sm text-[var(--text-secondary)]">
                <span className="text-lg">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)]">&copy; 2026 StudyDeep</p>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
