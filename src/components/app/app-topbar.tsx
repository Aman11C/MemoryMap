"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Menu, User as UserIcon, Shield, LogOut, LogIn, Database } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import Link from "next/link";

interface AppTopbarProps {
  onOpenSearch: () => void;
  onOpenQuickAdd: () => void;
  onToggleMobileNav?: () => void;
}

export function AppTopbar({
  onOpenSearch,
  onOpenQuickAdd,
  onToggleMobileNav,
}: AppTopbarProps) {
  const router = useRouter();
  const { user, profile, signOut, isConfigured } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const displayName =
    user?.user_metadata?.full_name ||
    profile?.full_name ||
    user?.email?.split("@")[0] ||
    "Elena Vance";

  const displayEmail = user?.email || "elena.vance@visualvault.me";

  const avatarUrl =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full px-4 sm:px-8 flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#090a0d]/80 backdrop-blur-xl">
      {/* Left: Mobile Nav Button + Search Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="md:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm transition-all group w-48 sm:w-72"
        >
          <Search className="w-4 h-4 text-zinc-400 group-hover:text-amber-500 transition-colors" />
          <span className="flex-1 text-left truncate">Search memories, places...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-white dark:bg-zinc-800 rounded border border-black/5 dark:border-white/5">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Add + Theme Toggle + User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Quick Add Memory Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs sm:text-sm font-medium hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Memory</span>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Profile Dropdown trigger */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-amber-500/20 transition-all"
            aria-label="User profile menu"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-black/10 dark:border-white/10">
              <Image
                src={avatarUrl}
                alt={displayName}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
          </button>

          {/* Profile Dropdown Panel */}
          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 p-2 rounded-2xl bg-white dark:bg-[#11141b] border border-black/10 dark:border-white/10 shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-100 text-xs">
                <div className="p-2.5 border-b border-black/5 dark:border-white/5 mb-1">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm capitalize">
                    {displayName}
                  </div>
                  <div className="text-zinc-400 text-xs truncate">
                    {displayEmail}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-mono">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isConfigured ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                      }`}
                    />
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {isConfigured ? "Supabase Connected" : "Local Mode (No Supabase keys)"}
                    </span>
                  </div>
                </div>

                <div className="p-1.5 space-y-0.5 text-zinc-600 dark:text-zinc-300">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/[0.04] cursor-pointer">
                    <UserIcon className="w-4 h-4 text-zinc-400" />
                    <span>Memory Profile</span>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/[0.04] cursor-pointer">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>RLS Protected Vault</span>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/[0.04] cursor-pointer">
                    <Database className="w-4 h-4 text-amber-500" />
                    <span>PostgreSQL Storage</span>
                  </div>
                </div>

                <div className="pt-1.5 mt-1 border-t border-black/5 dark:border-white/5 space-y-1">
                  {user ? (
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors text-xs font-medium text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors text-xs font-medium"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </Link>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
