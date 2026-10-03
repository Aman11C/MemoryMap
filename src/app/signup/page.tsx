"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, Lock, Mail, User, ArrowRight, Sparkles, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { SupabaseSetupCard } from "@/components/supabase-setup-card";

export default function SignUpPage() {
  const router = useRouter();
  const { signUpWithPassword, signInWithOAuth, isConfigured } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const { error, data } = await signUpWithPassword(email, password, fullName);

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    } else {
      // Check if session was created immediately (email confirmation disabled in Supabase)
      if (data?.session) {
        router.push("/dashboard");
      } else {
        setIsSuccess(true);
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    const { error } = await signInWithOAuth("google");
    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#07080b] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="font-serif font-medium text-lg tracking-tight text-zinc-900 dark:text-white">
            MemoryMap
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Sign Up Card */}
      <div className="w-full max-w-md mx-auto my-8 space-y-6">
        {!isConfigured && <SupabaseSetupCard />}

        <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#11141b] border border-black/10 dark:border-white/10 shadow-xl space-y-6">
          {isSuccess ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif text-zinc-900 dark:text-white">
                Check your email
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
                We sent a confirmation link to <strong className="text-zinc-800 dark:text-zinc-200">{email}</strong>. Click it to activate your personal visual vault.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-medium"
                >
                  Return to sign in
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Begin Your Visual Legacy
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-light text-zinc-900 dark:text-white">
                  Create your memory vault
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                  Private, encrypted personal memory archiving
                </p>
              </div>

              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs space-y-2">
                  <div className="flex items-start gap-2.5 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                  {errorMessage.toLowerCase().includes("rate limit") && (
                    <div className="pt-2 border-t border-rose-500/20 text-[11px] text-zinc-600 dark:text-zinc-300 space-y-1.5 leading-relaxed">
                      <div className="font-semibold text-rose-700 dark:text-rose-300">
                        How to fix in 10 seconds:
                      </div>
                      <p>
                        Supabase free projects limit built-in verification emails to 3 per hour. To remove this limit for development:
                      </p>
                      <ol className="list-decimal pl-4 space-y-0.5">
                        <li>
                          Open your{" "}
                          <a
                            href="https://supabase.com/dashboard/project/pkrvvdnmzkgxrnikgsfv/auth/providers"
                            target="_blank"
                            rel="noreferrer"
                            className="underline font-medium text-amber-600 dark:text-amber-400"
                          >
                            Supabase Auth Providers Dashboard ↗
                          </a>
                        </li>
                        <li>Click <strong>Email</strong> to expand its settings.</li>
                        <li>Toggle <strong>&ldquo;Confirm email&rdquo;</strong> to <strong>OFF</strong>.</li>
                        <li>Click <strong>Save</strong>.</li>
                      </ol>
                      <p className="pt-1 text-zinc-500 dark:text-zinc-400">
                        Once disabled, users sign up and log in instantly without waiting for an email or hitting SMTP rate limits!
                      </p>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
                    <input
                      type="text"
                      required
                      placeholder="Elena Vance"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
                    <input
                      type="email"
                      required
                      placeholder="elena@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
                    <input
                      type="password"
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 mt-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-medium text-sm hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Create Vault</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="relative flex items-center justify-center pt-1">
                <div className="border-t border-black/5 dark:border-white/5 w-full" />
                <span className="bg-white dark:bg-[#11141b] px-3 text-[11px] text-zinc-400 uppercase tracking-wider shrink-0">
                  Or
                </span>
                <div className="border-t border-black/5 dark:border-white/5 w-full" />
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.02] hover:bg-zinc-100 dark:hover:bg-white/[0.05] text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-colors flex items-center justify-center gap-2.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign up with Google</span>
              </button>

              <div className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-amber-600 dark:text-amber-400 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} MemoryMap. Row-Level Security Protected.
      </div>
    </div>
  );
}
