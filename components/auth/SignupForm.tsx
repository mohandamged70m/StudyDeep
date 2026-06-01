"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

type SignupFormData = z.infer<typeof signupSchema>;

function passwordStrength(password: string): { label: string; color: string; width: string } {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  if (score <= 1) return { label: "Weak", color: "bg-coral", width: "w-1/5" };
  if (score <= 2) return { label: "Fair", color: "bg-amber-mid", width: "w-2/5" };
  if (score <= 3) return { label: "Good", color: "bg-amber", width: "w-3/5" };
  if (score <= 4) return { label: "Strong", color: "bg-teal", width: "w-4/5" };
  return { label: "Very strong", color: "bg-green", width: "w-full" };
}

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password", "");
  const strength = passwordStrength(password);

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    const supabase = createClient();

    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.push("/onboarding");
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });

    if (authError) {
      setError(authError.message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber text-white font-heading font-semibold text-xl">
          S
        </div>
        <h1 className="font-heading text-2xl font-semibold text-[var(--text-primary)]">Create your account</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Start studying smarter today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
            Full name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Jane Smith"
            {...register("name")}
            className="w-full rounded-[var(--radius)] border border-[var(--border-color)] bg-white px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all focus:outline-none focus:ring-2 focus:ring-amber/30 focus:border-amber"
          />
          {errors.name && <p className="mt-1 text-xs text-coral">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@university.edu"
            {...register("email")}
            className="w-full rounded-[var(--radius)] border border-[var(--border-color)] bg-white px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all focus:outline-none focus:ring-2 focus:ring-amber/30 focus:border-amber"
          />
          {errors.email && <p className="mt-1 text-xs text-coral">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              {...register("password")}
              className="w-full rounded-[var(--radius)] border border-[var(--border-color)] bg-white px-4 py-2.5 pr-10 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all focus:outline-none focus:ring-2 focus:ring-amber/30 focus:border-amber"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {password && (
            <div className="mt-1.5">
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--cream-3)]">
                  <div className={`h-full rounded-full ${strength.color} ${strength.width} transition-all`} />
                </div>
                <span className="text-[10px] font-medium text-[var(--text-muted)]">{strength.label}</span>
              </div>
            </div>
          )}
          {errors.password && <p className="mt-1 text-xs text-coral">{errors.password.message}</p>}
        </div>

        {error && (
          <div className="rounded-[var(--radius)] bg-coral-light px-4 py-2.5 text-xs text-coral">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-amber px-4 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Create account
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 border-t border-[var(--border-color)]" />
        <span className="text-xs text-[var(--text-muted)]">or</span>
        <div className="flex-1 border-t border-[var(--border-color)]" />
      </div>

      <button
        onClick={handleGoogleSignup}
        disabled={isGoogleLoading}
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius)] border border-[var(--border-color)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-all hover:bg-[var(--cream-2)] disabled:opacity-60 cursor-pointer"
      >
        {isGoogleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        )}
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-amber hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
