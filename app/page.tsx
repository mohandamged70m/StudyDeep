import Link from "next/link";

const FEATURES = [
  {
    icon: "📄",
    title: "Upload Any Source",
    desc: "PDFs, lecture notes, YouTube links — StudyDeep extracts and indexes everything into your personal notebook.",
  },
  {
    icon: "🤖",
    title: "Chat with AI Citations",
    desc: "Ask questions and get answers drawn exclusively from your sources, with citations you can verify.",
  },
  {
    icon: "🃏",
    title: "Smart Flashcards",
    desc: "Auto-generated Q&A cards with spaced repetition. Study, browse, or quiz yourself.",
  },
  {
    icon: "🧠",
    title: "Mind Maps & Summaries",
    desc: "AI extracts key concepts, relationships, and generates concise summaries of all your materials.",
  },
  {
    icon: "📅",
    title: "Study Plans",
    desc: "Tell it your exam date and available hours — get a day-by-day plan with tasks and priorities.",
  },
  {
    icon: "🔬",
    title: "RAG-Powered",
    desc: "Retrieval-Augmented Generation ensures every answer is grounded in your actual study materials.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      {/* Header */}
      <header className="border-b border-[var(--border-color)] bg-white/60 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber text-white font-heading font-semibold text-lg">
              S
            </div>
            <span className="font-heading text-lg font-semibold text-[var(--text-primary)]">
              StudyDeep
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--text-secondary)] sm:flex">
            <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[var(--text-primary)] transition-colors">How it works</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-[var(--radius)] border border-[var(--border-color)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-all hover:bg-[var(--cream-2)]"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-[var(--radius)] bg-amber px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-24 pb-16 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber/20 bg-amber-light px-3 py-1 text-xs font-medium text-amber">
          AI-Powered Study Companion
        </span>
        <h1 className="mt-6 font-heading text-4xl font-semibold leading-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
          Your materials.
          <br />
          <span className="text-amber">Your understanding.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--text-secondary)] leading-relaxed">
          Upload PDFs, notes, or YouTube links and let AI turn them into an interactive study
          experience. Chat with your sources, generate flashcards, explore mind maps, and follow
          a personalized study plan.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-amber px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90"
          >
            Start studying free
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border-color)] bg-white px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition-all hover:bg-[var(--cream-2)]"
          >
            See features
          </a>
        </div>

        {/* App preview mockup */}
        <div className="mt-14 mx-auto max-w-4xl rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-white p-2 shadow-md">
          <div className="rounded-[var(--radius)] bg-[var(--cream-2)] p-1">
            <div className="flex h-8 items-center gap-1.5 border-b border-[var(--border-color)] px-3">
              <span className="h-2.5 w-2.5 rounded-full bg-coral/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-mid/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-teal/60" />
              <span className="ml-3 text-[10px] font-medium text-[var(--text-muted)]">StudyDeep — Biology 101</span>
            </div>
            <div className="grid min-h-[280px] grid-cols-3 gap-px bg-[var(--border-color)]">
              <div className="bg-[var(--cream-2)] p-3 text-right text-xs text-[var(--text-muted)]">Sources panel</div>
              <div className="col-span-2 bg-white p-4 text-right text-xs text-[var(--text-muted)]">Chat area</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-[var(--border-color)] bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-semibold text-[var(--text-primary)]">
              Everything you need to study smarter
            </h2>
            <p className="mt-2 text-base text-[var(--text-secondary)]">
              Upload once, interact with your materials in every way imaginable.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-white p-6 transition-all hover:shadow-md"
              >
                <span className="text-2xl">{f.icon}</span>
                <h3 className="mt-3 font-heading text-base font-semibold text-[var(--text-primary)]">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="font-heading text-3xl font-semibold text-[var(--text-primary)]">
            Three simple steps
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { step: "1", icon: "📤", title: "Upload", desc: "Drop your PDFs, paste notes, or add a YouTube link." },
              { step: "2", icon: "💬", title: "Interact", desc: "Chat with AI, flip flashcards, explore mind maps." },
              { step: "3", icon: "✅", title: "Master", desc: "Take quizzes, follow your study plan, ace the exam." },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-light text-2xl">
                  {icon}
                </div>
                <span className="mt-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber text-[11px] font-bold text-white">
                  {step}
                </span>
                <h3 className="mt-3 font-heading text-base font-semibold text-[var(--text-primary)]">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] bg-white py-8 text-center text-sm text-[var(--text-muted)]">
        <p>StudyDeep &mdash; Built with care for students everywhere.</p>
      </footer>
    </div>
  );
}
