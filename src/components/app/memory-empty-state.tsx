"use client";

import { Plus, Compass, Sparkles } from "lucide-react";

interface MemoryEmptyStateProps {
  onOpenCreate: () => void;
  onLoadDemo?: () => void;
  title?: string;
  description?: string;
  showDemo?: boolean;
}

export function MemoryEmptyState({
  onOpenCreate,
  onLoadDemo,
  title = "Your visual history begins here",
  description = "You haven't archived any memories in your private vault yet. Drag and drop your favorite photographs to start building your personal timeline and map.",
  showDemo,
}: MemoryEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 p-10 sm:p-16 text-center max-w-2xl mx-auto my-8 bg-white/40 dark:bg-[#11141b]/40 backdrop-blur-sm">
      <div className="relative w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-5 border border-amber-500/20 shadow-inner">
        <Compass className="w-8 h-8 stroke-[1.8]" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 animate-ping opacity-75" />
      </div>

      <div className="space-y-2 max-w-md mx-auto mb-6">
        <h3 className="text-xl sm:text-2xl font-serif font-light text-zinc-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onOpenCreate}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs sm:text-sm font-medium hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Upload First Memory</span>
        </button>

        {onLoadDemo && (
          <button
            onClick={onLoadDemo}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{showDemo ? "Hide Demo Archive" : "Load Demo Archive"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
