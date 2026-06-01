import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-heading",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StudyDeep — AI-Powered Study Platform",
  description:
    "Upload your study materials and interact with them using AI. Chat, generate flashcards, view mind maps, and ace your exams.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${lora.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}
