"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-full border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] ${className}`}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle visual theme"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/80 backdrop-blur-md text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-700 transition-transform duration-300 rotate-0 scale-100" />
      )}
    </button>
  );
}
