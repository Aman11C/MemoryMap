"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  Clock,
  MapPin,
  Users,
  Film,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Compass,
  LogOut,
  LogIn,
  Database,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface AppSidebarProps {
  onOpenQuickAdd?: () => void;
  className?: string;
  onCloseMobile?: () => void;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Memories", href: "/memories", icon: Images },
  { label: "Timeline", href: "/timeline", icon: Clock },
  { label: "Map", href: "/map", icon: MapPin },
  { label: "People", href: "/people", icon: Users },
  { label: "Stories", href: "/stories", icon: Film },
];

export function AppSidebar({ className = "", onCloseMobile }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut, isConfigured } = useAuth();

  const handleSignOut = async () => {
    if (onCloseMobile) onCloseMobile();
    await signOut();
    router.push("/login");
  };

  const displayName =
    user?.user_metadata?.full_name ||
    profile?.full_name ||
    user?.email?.split("@")[0] ||
    "Elena Vance (Demo)";

  return (
    <aside
      className={`w-64 h-full flex flex-col justify-between border-r border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#0c0e14]/90 backdrop-blur-xl transition-all ${className}`}
    >
      {/* Top Branding */}
      <div className="p-6">
        <Link
          href="/"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-serif font-medium text-lg tracking-tight text-zinc-900 dark:text-white">
              MemoryMap
            </span>
            <span className="block text-[10px] uppercase font-mono tracking-widest text-amber-600 dark:text-amber-400">
              Personal Vault
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="mt-8 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? "bg-amber-500/10 text-amber-900 dark:text-amber-300 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 w-1 h-5 bg-amber-500 rounded-r-full" />
                )}
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Vault Status & Auth Controls */}
      <div className="p-4 space-y-3 border-t border-black/5 dark:border-white/5">
        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> RLS Vault
            </span>
            <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
              <Database className="w-3 h-3 text-amber-500" />
              {isConfigured ? "Supabase" : "Local"}
            </span>
          </div>
          <div className="text-[11px] text-zinc-600 dark:text-zinc-300 truncate font-medium">
            {displayName}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Link
            href="/"
            onClick={onCloseMobile}
            className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Landing
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
          </Link>

          {user ? (
            <button
              onClick={handleSignOut}
              title="Log Out"
              aria-label="Log Out"
              className="p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href="/login"
              onClick={onCloseMobile}
              title="Sign In"
              aria-label="Sign In"
              className="p-2 rounded-xl text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
