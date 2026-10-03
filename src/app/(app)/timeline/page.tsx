"use client";

import { useState, useMemo } from "react";
import { Clock, MapPin, Calendar, Users, Sparkles } from "lucide-react";
import Image from "next/image";
import { useMemoryContext } from "@/context/memory-context";
import { MemoryEmptyState } from "@/components/app/memory-empty-state";
import { DatabaseMemory } from "@/lib/services/memory-service";
import { Memory } from "@/lib/types";

export default function TimelinePage() {
  const {
    dbMemories,
    mockMemories,
    showDemoData,
    toggleShowDemoData,
    openMemoryDetail,
    openCreate,
  } = useMemoryContext();

  const [selectedYear, setSelectedYear] = useState<number | "all">("all");

  // Determine active pool of memories
  const activeMemories = useMemo(() => {
    if (dbMemories.length > 0) return dbMemories;
    if (showDemoData) return mockMemories;
    return [];
  }, [dbMemories, showDemoData, mockMemories]);

  // Extract years present in memories, sorted descending
  const years = useMemo(() => {
    const set = new Set<number>();
    for (const m of activeMemories) {
      if (m.date) {
        const y = new Date(m.date).getFullYear();
        if (!isNaN(y)) set.add(y);
      }
    }
    return Array.from(set).sort((a, b) => b - a);
  }, [activeMemories]);

  // Filter memories by selected year
  const filteredMemories = useMemo(() => {
    return activeMemories.filter((m) => {
      if (selectedYear === "all") return true;
      const y = new Date(m.date).getFullYear();
      return y === selectedYear;
    });
  }, [activeMemories, selectedYear]);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            <Clock className="w-3.5 h-3.5" /> Chronological Thread
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-light text-zinc-900 dark:text-white">
            Visual Timeline
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Follow your life&apos;s story unbroken from year to year
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {dbMemories.length === 0 && (
            <button
              onClick={toggleShowDemoData}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition-colors ${
                showDemoData
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
                  : "border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{showDemoData ? "Hide Demo Memories" : "Show Demo Archive"}</span>
            </button>
          )}

          {years.length > 0 && (
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-white dark:bg-[#11141b] border border-black/10 dark:border-white/10 shadow-sm">
              <button
                onClick={() => setSelectedYear("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedYear === "all"
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                All
              </button>
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    selectedYear === y
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {activeMemories.length === 0 ? (
        <MemoryEmptyState
          onOpenCreate={openCreate}
          onLoadDemo={toggleShowDemoData}
          showDemo={showDemoData}
        />
      ) : (
        /* Timeline Stream */
        <div className="relative pl-6 sm:pl-10 space-y-12">
          {/* Continuous luminous spine */}
          <div className="absolute left-[11px] sm:left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-amber-500 via-amber-500/40 to-transparent" />

          {years.map((year) => {
            const memoriesInYear = filteredMemories.filter(
              (m) => new Date(m.date).getFullYear() === year
            );
            if (memoriesInYear.length === 0) return null;

            return (
              <div key={year} className="space-y-6">
                {/* Year Pin Marker */}
                <div className="relative flex items-center gap-3">
                  <div className="absolute -left-[30px] sm:-left-[38px] w-6 h-6 rounded-full bg-amber-500 border-4 border-white dark:border-[#08090c] shadow-md flex items-center justify-center text-white" />
                  <span className="font-serif text-2xl font-light tracking-wide text-zinc-900 dark:text-white">
                    {year}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    ({memoriesInYear.length} key moments)
                  </span>
                </div>

                {/* Cards within this year */}
                <div className="space-y-6">
                  {memoriesInYear.map((mem) => {
                    const isDb = "photos" in mem;
                    const dbM = isDb ? (mem as DatabaseMemory) : null;
                    const coverPhoto =
                      (dbM?.photos[0]?.image_url) ||
                      (mem as Memory).coverImage ||
                      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";
                    const loc =
                      (dbM?.location_name) ||
                      (mem as Memory).locationName ||
                      (mem as Memory).city ||
                      "Location unspecified";
                    const peopleNames = isDb
                      ? (dbM?.people || []).map((p) => p.name).join(", ")
                      : (mem as Memory).people?.map((p) => p.name).join(", ") || "";

                    return (
                      <div
                        key={mem.id}
                        onClick={() => openMemoryDetail(mem.id)}
                        className="group cursor-pointer relative rounded-3xl bg-white dark:bg-[#11141b] border border-black/10 dark:border-white/10 hover:border-amber-500/40 p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-5"
                      >
                        {/* Small Node on spine */}
                        <div className="hidden sm:block absolute -left-[35px] top-8 w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700 ring-4 ring-white dark:ring-[#08090c] group-hover:bg-amber-500 transition-colors" />

                        {/* Image Preview */}
                        <div className="relative w-full md:w-56 h-48 md:h-auto rounded-2xl overflow-hidden shrink-0 bg-zinc-200 dark:bg-zinc-800">
                          <Image
                            src={coverPhoto}
                            alt={mem.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 240px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                          <div className="absolute bottom-2.5 left-2.5 text-[11px] font-medium text-white flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-400" />
                            {loc}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-zinc-400">
                              <span className="flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
                                <Calendar className="w-3.5 h-3.5" /> {mem.date}
                              </span>
                            </div>

                            <h3 className="font-serif text-xl font-medium text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                              {mem.title}
                            </h3>

                            {mem.description && (
                              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-serif leading-relaxed line-clamp-2">
                                &ldquo;{mem.description}&rdquo;
                              </p>
                            )}
                          </div>

                          {/* Bottom Footer Metadata */}
                          <div className="pt-3 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                            <div className="flex items-center gap-2">
                              <Users className="w-3.5 h-3.5 text-zinc-400" />
                              <span>{peopleNames || "Solo excursion"}</span>
                            </div>
                            {mem.tags && mem.tags.length > 0 && (
                              <span className="text-[11px] font-mono">
                                {mem.tags.slice(0, 3).map((t) => `#${t}`).join(" ")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
