"use client";

import { useState } from "react";
import { AlertCircle, Copy, Check, Database, ExternalLink, Code2 } from "lucide-react";

export function SupabaseSetupCard({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const [showSql, setShowSql] = useState(false);

  const envSample = `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;

  const copyEnv = () => {
    navigator.clipboard.writeText(envSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-3xl border border-amber-500/30 bg-amber-500/[0.04] dark:bg-amber-500/[0.03] p-5 sm:p-6 backdrop-blur-md shadow-sm ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-medium text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <span>Supabase Backend Connection</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300">
                Setup Notice
              </span>
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              To activate real PostgreSQL persistence, user authentication, and storage, add your
              project keys to <code className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[11px]">.env.local</code>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setShowSql(!showSql)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{showSql ? "Hide Schema" : "View Schema"}</span>
          </button>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-medium hover:opacity-90 transition-opacity"
          >
            <span>Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Code Block for Environment Variables */}
      <div className="mt-4 pt-4 border-t border-amber-500/20">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mb-2">
          <span>Required in .env.local:</span>
          <button
            onClick={copyEnv}
            className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy example"}
          </button>
        </div>
        <pre className="p-3 rounded-xl bg-zinc-900 text-zinc-200 text-xs font-mono overflow-x-auto border border-black/10 dark:border-white/10 selection:bg-amber-500/30">
          {envSample}
        </pre>
      </div>

      {/* Schema Instructions dropdown */}
      {showSql && (
        <div className="mt-4 pt-4 border-t border-amber-500/20 text-xs text-zinc-600 dark:text-zinc-400 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-medium text-zinc-900 dark:text-white">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Database & Storage Quick Setup:
          </div>
          <p>
            1. Open your project in the Supabase Dashboard → <strong>SQL Editor</strong>.
          </p>
          <p>
            2. Run the SQL script from{" "}
            <code className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[11px]">
              supabase/schema.sql
            </code>{" "}
            included in this codebase.
          </p>
          <p>
            3. It will create the 6 tables (<code className="font-mono">profiles</code>, <code className="font-mono">memories</code>, <code className="font-mono">photos</code>, <code className="font-mono">people</code>, <code className="font-mono">memory_people</code>, <code className="font-mono">stories</code>), enable Row Level Security, auto-create user profiles upon signup, and configure the <code className="font-mono">memory-photos</code> storage bucket.
          </p>
        </div>
      )}
    </div>
  );
}
