"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Upload, Link, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const COLORS = ["#D4891A", "#1A7A6A", "#C94F2C", "#5B4FBF", "#2E7D50", "#2563EB"];
const EMOJIS = ["📚", "🔬", "🧮", "⚗️", "📖", "🌍", "💻", "🧬", "📐", "🎨", "🏛️", "🔭"];

const FEATURES = [
  { icon: "📄", title: "Sources", desc: "Upload PDFs, paste notes, or add YouTube links" },
  { icon: "🤖", title: "Ask AI", desc: "Chat with your materials, get cited answers" },
  { icon: "🃏", title: "Flashcards", desc: "Auto-generated cards with spaced repetition" },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [userName, setUserName] = useState("");
  const [nbTitle, setNbTitle] = useState("");
  const [nbEmoji, setNbEmoji] = useState("📚");
  const [nbColor, setNbColor] = useState(COLORS[0]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.name) setUserName(user.user_metadata.name);
    });
  }, []);

  const goTo = (s: number) => {
    setDirection(s > step ? 1 : -1);
    setStep(s);
  };

  const handleCreateNotebook = async () => {
    setIsCreating(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("notebooks").insert({
      title: nbTitle || "Untitled Notebook",
      emoji: nbEmoji,
      color: nbColor,
      user_id: user.id,
    });

    if (error) {
      console.error("Failed to create notebook", error);
    }

    setIsCreating(false);
    goTo(2);
  };

  const finish = () => {
    router.push("/notebooks");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-amber" : i < step ? "w-4 bg-amber/50" : "w-4 bg-[var(--cream-3)]"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-light text-4xl">
                  🎓
                </div>
                <h1 className="font-heading text-3xl font-semibold text-[var(--text-primary)]">
                  Welcome to StudyDeep{userName ? `, ${userName}` : ""}
                </h1>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Upload your materials and let AI turn them into an interactive study experience.
                </p>

                <div className="mt-8 grid gap-3">
                  {FEATURES.map((f) => (
                    <div key={f.title} className="flex items-center gap-3 rounded-[var(--radius)] border border-[var(--border-color)] bg-white p-4 text-left">
                      <span className="text-xl">{f.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-[var(--text-primary)]">{f.title}</div>
                        <div className="text-xs text-[var(--text-secondary)]">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => goTo(1)}
                  className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius)] bg-amber px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 cursor-pointer"
                >
                  Let&apos;s get started
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            )}

            {/* Step 1: Create notebook */}
            {step === 1 && (
              <div>
                <h2 className="text-center font-heading text-2xl font-semibold text-[var(--text-primary)]">
                  Create your first notebook
                </h2>
                <p className="mt-1 text-center text-sm text-[var(--text-secondary)]">
                  A notebook holds all your sources for one subject.
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">Notebook name</label>
                    <input
                      type="text"
                      placeholder="e.g. Biology 201, Calculus II..."
                      value={nbTitle}
                      onChange={(e) => setNbTitle(e.target.value)}
                      className="w-full rounded-[var(--radius)] border border-[var(--border-color)] bg-white px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-amber/30 focus:border-amber"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Choose an emoji</label>
                    <div className="flex flex-wrap gap-2">
                      {EMOJIS.map((e) => (
                        <button
                          key={e}
                          onClick={() => setNbEmoji(e)}
                          className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius)] text-lg transition-all cursor-pointer ${
                            nbEmoji === e ? "bg-amber-light ring-2 ring-amber" : "bg-white border border-[var(--border-color)] hover:bg-[var(--cream-2)]"
                          }`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Color theme</label>
                    <div className="flex gap-2">
                      {COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setNbColor(c)}
                          className={`h-8 w-8 rounded-full transition-all cursor-pointer ${
                            nbColor === c ? "ring-2 ring-amber ring-offset-2" : ""
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => goTo(0)}
                    className="flex-1 rounded-[var(--radius)] border border-[var(--border-color)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-all hover:bg-[var(--cream-2)] cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreateNotebook}
                    disabled={isCreating}
                    className="flex-1 rounded-[var(--radius)] bg-amber px-4 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-60 cursor-pointer"
                  >
                    {isCreating ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      "Create notebook"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Add first source */}
            {step === 2 && (
              <div>
                <h2 className="text-center font-heading text-2xl font-semibold text-[var(--text-primary)]">
                  Add your first source
                </h2>
                <p className="mt-1 text-center text-sm text-[var(--text-secondary)]">
                  Upload a PDF, paste text, or add a YouTube video.
                </p>

                <div className="mt-6 grid gap-3">
                  <button className="flex items-center gap-4 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border-color)] bg-white p-5 text-left transition-all hover:border-amber hover:bg-amber-light/30 cursor-pointer">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-coral-light text-xl">
                      📄
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Upload PDF</div>
                      <div className="text-xs text-[var(--text-secondary)]">Drop your textbook or lecture notes</div>
                    </div>
                  </button>

                  <button className="flex items-center gap-4 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border-color)] bg-white p-5 text-left transition-all hover:border-amber hover:bg-amber-light/30 cursor-pointer">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-teal-light text-xl">
                      📝
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Paste Text</div>
                      <div className="text-xs text-[var(--text-secondary)]">Paste lecture notes or any text</div>
                    </div>
                  </button>

                  <button className="flex items-center gap-4 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border-color)] bg-white p-5 text-left transition-all hover:border-amber hover:bg-amber-light/30 cursor-pointer">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-violet-light text-xl">
                      ▶️
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">YouTube Link</div>
                      <div className="text-xs text-[var(--text-secondary)]">Add a lecture or tutorial video</div>
                    </div>
                  </button>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => goTo(1)}
                    className="flex-1 rounded-[var(--radius)] border border-[var(--border-color)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-all hover:bg-[var(--cream-2)] cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={finish}
                    className="flex-1 rounded-[var(--radius)] bg-amber px-4 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 cursor-pointer"
                  >
                    I&apos;ll add sources later
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
