"use client";

import { useState, useMemo } from "react";
import {
  Images,
  MapPin,
  Users,
  Film,
  Plus,
  Sparkles,
  Calendar,
  ArrowRight,
  ChevronRight,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MOCK_STATS, MOCK_STORIES } from "@/lib/mock-data";
import { useMemoryContext } from "@/context/memory-context";
import { useAuth } from "@/context/auth-context";
import { SupabaseSetupCard } from "@/components/supabase-setup-card";
import { MemoryCard } from "@/components/app/memory-card";
import { MemoryEmptyState } from "@/components/app/memory-empty-state";
import { DatabaseMemory } from "@/lib/services/memory-service";

export default function DashboardPage() {
  const {
    dbMemories,
    mockMemories,
    showDemoData,
    toggleShowDemoData,
    openMemoryDetail,
    openCreate,
    openEdit,
  } = useMemoryContext();
  const { user, profile, isConfigured } = useAuth();
  const [filter, setFilter] = useState<string>("all");

  const displayName =
    user?.user_metadata?.full_name ||
    profile?.full_name ||
    user?.email?.split("@")[0] ||
    "Elena";

  // Derive stats dynamically
  const stats = useMemo(() => {
    if (dbMemories.length > 0) {
      const placesSet = new Set(
        dbMemories.map((m) => m.location_name?.trim()).filter(Boolean)
      );
      const peopleSet = new Set(
        dbMemories
          .flatMap((m) => (m.people || []).map((p) => p.name.trim()))
          .filter(Boolean)
      );
      return {
        memories: dbMemories.length,
        places: placesSet.size,
        people: peopleSet.size,
        stories: 0,
      };
    }
    if (showDemoData) {
      return MOCK_STATS;
    }
    return { memories: 0, places: 0, people: 0, stories: 0 };
  }, [dbMemories, showDemoData]);

  // Active pool of memories
  const activeMemories = useMemo(() => {
    if (dbMemories.length > 0) return dbMemories;
    if (showDemoData) return mockMemories;
    return [];
  }, [dbMemories, showDemoData, mockMemories]);

  // Featured memory (first memory or mock)
  const featuredMemory = activeMemories[0] || null;
  const onThisDayMemory = activeMemories.length > 1 ? activeMemories[1] : featuredMemory;

  // Filtered recent memories
  const recentMemories = useMemo(() => {
    return activeMemories.filter((m) => {
      if (filter === "all") return true;
      const isDb = "photos" in m;
      const category = (isDb ? (m as DatabaseMemory).activity : (m as { category?: string }).category) || "";
      return category.toLowerCase() === filter.toLowerCase();
    });
  }, [activeMemories, filter]);

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      {/* Supabase Notice if not configured */}
      {!isConfigured && <SupabaseSetupCard />}

      {/* Top Greeting & Action Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 mb-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Curated visual history
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-tight text-zinc-900 dark:text-white">
            Your memories,{" "}
            <span className="italic font-normal text-amber-600 dark:text-amber-400">
              beautifully connected.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-light">
            Welcome back, <span className="capitalize">{displayName}</span>.{" "}
            {stats.memories > 0 ? (
              <>{stats.memories} personal moments anchored in time and geography.</>
            ) : (
              <>Start preserving your visual story today.</>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {dbMemories.length === 0 && (
            <button
              onClick={toggleShowDemoData}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-medium border transition-colors ${
                showDemoData
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
                  : "border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{showDemoData ? "Hide Demo Archive" : "Show Demo Archive"}</span>
            </button>
          )}

          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-medium text-sm hover:opacity-90 active:scale-95 transition-all shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Add Memory</span>
          </button>
        </div>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {[
          {
            label: "Memories",
            value: stats.memories,
            icon: Images,
            href: "/memories",
            badge: "Captured",
            accent: "group-hover:border-amber-500/40",
          },
          {
            label: "Places",
            value: stats.places,
            icon: MapPin,
            href: "/map",
            badge: "Mapped",
            accent: "group-hover:border-emerald-500/40",
          },
          {
            label: "People",
            value: stats.people,
            icon: Users,
            href: "/people",
            badge: "Recognized",
            accent: "group-hover:border-indigo-500/40",
          },
          {
            label: "Stories",
            value: stats.stories,
            icon: Film,
            href: "/stories",
            badge: "Curated",
            accent: "group-hover:border-rose-500/40",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#11141b] border border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/15 transition-all duration-300 group shadow-sm hover:shadow-md relative overflow-hidden ${stat.accent}`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-white/[0.04] flex items-center justify-center text-zinc-700 dark:text-zinc-200 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 group-hover:text-amber-500 transition-colors flex items-center gap-0.5">
                  {stat.badge} <ChevronRight className="w-3 h-3" />
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-serif font-light text-zinc-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
                  {stat.label}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* When no memories exist and demo mode is off, show pristine empty state */}
      {activeMemories.length === 0 ? (
        <MemoryEmptyState
          onOpenCreate={openCreate}
          onLoadDemo={toggleShowDemoData}
          showDemo={showDemoData}
        />
      ) : (
        <>
          {/* Featured Memory & On This Day Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Featured Memory (7 cols) */}
            {featuredMemory && (() => {
              const isDb = "photos" in featuredMemory;
              const dbM = isDb ? (featuredMemory as DatabaseMemory) : null;
              const coverImg =
                (dbM?.photos[0]?.image_url) ||
                (featuredMemory as { coverImage?: string }).coverImage ||
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";
              const locationStr =
                (dbM?.location_name) ||
                (featuredMemory as { locationName?: string }).locationName ||
                (featuredMemory as { city?: string }).city ||
                "Location not specified";
              const companionNames = isDb
                ? (dbM?.people || []).map((p) => p.name).join(", ")
                : (featuredMemory as { people?: { name: string }[] }).people?.map((p) => p.name).join(", ") || "";

              return (
                <div className="lg:col-span-7 flex flex-col">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Featured Memory
                    </span>
                    <span className="text-xs text-zinc-400">
                      {isDb ? "Live Vault Memory" : "Archived Collection"}
                    </span>
                  </div>

                  <div
                    onClick={() => openMemoryDetail(featuredMemory.id)}
                    className="flex-1 group cursor-pointer relative rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 shadow-lg min-h-[360px] flex flex-col justify-end p-6 sm:p-8 transition-transform hover:-translate-y-1 duration-300"
                  >
                    {/* Background Image */}
                    <Image
                      src={coverImg}
                      alt={featuredMemory.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    {/* Cinematic Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Content Info */}
                    <div className="relative z-10 space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-md text-white border border-white/20">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {locationStr}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-serif text-white leading-tight">
                        {featuredMemory.title}
                      </h2>

                      {featuredMemory.description && (
                        <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 font-serif italic max-w-xl">
                          &ldquo;{featuredMemory.description}&rdquo;
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-zinc-300 border-t border-white/15">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          {featuredMemory.date}
                        </span>
                        {companionNames && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-2">
                              <span>With {companionNames}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* On This Day / Relive Memory Card (5 cols) */}
            {onThisDayMemory && (() => {
              const isDb = "photos" in onThisDayMemory;
              const dbM = isDb ? (onThisDayMemory as DatabaseMemory) : null;
              const coverImg =
                (dbM?.photos[0]?.image_url) ||
                (onThisDayMemory as { coverImage?: string }).coverImage ||
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";
              const locationStr =
                (dbM?.location_name) ||
                (onThisDayMemory as { locationName?: string }).locationName ||
                (onThisDayMemory as { city?: string }).city ||
                "Location not specified";

              return (
                <div className="lg:col-span-5 flex flex-col">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> On This Day
                    </span>
                    <span className="text-xs text-zinc-400">{onThisDayMemory.date}</span>
                  </div>

                  <div
                    onClick={() => openMemoryDetail(onThisDayMemory.id)}
                    className="flex-1 group cursor-pointer relative rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#11141b] shadow-lg flex flex-col justify-between p-6 sm:p-7 transition-all duration-300 hover:border-amber-500/40"
                  >
                    {/* Top Photo & Badge */}
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-zinc-200 dark:bg-zinc-800">
                      <Image
                        src={coverImg}
                        alt={onThisDayMemory.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 text-xs font-medium text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {locationStr}
                      </div>
                    </div>

                    {/* Middle Narrative */}
                    <div className="space-y-2">
                      <div className="text-xs font-mono text-amber-600 dark:text-amber-400 uppercase">
                        {onThisDayMemory.date}
                      </div>
                      <h3 className="text-xl font-serif text-zinc-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {onThisDayMemory.title}
                      </h3>
                      {onThisDayMemory.description && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                          {onThisDayMemory.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Button Action */}
                    <div className="pt-4 mt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Captured in time</span>
                      <span className="font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Relive moment <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Recent Memories Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
              <div>
                <h2 className="text-2xl font-serif font-light text-zinc-900 dark:text-white">
                  Recent Memories
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Chronologically sorted moments from your private journal
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: "all", label: "All" },
                  { id: "travel", label: "Travel" },
                  { id: "nature", label: "Nature" },
                  { id: "milestone", label: "Milestones" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      filter === f.id
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm"
                        : "bg-white dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}

                <Link
                  href="/memories"
                  className="text-xs text-amber-600 dark:text-amber-400 hover:underline ml-2 flex items-center gap-1 shrink-0 font-medium"
                >
                  View all ({activeMemories.length}) <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentMemories.slice(0, 6).map((mem) => (
                <MemoryCard
                  key={mem.id}
                  memory={mem}
                  onClick={() => openMemoryDetail(mem.id)}
                  onEdit={
                    "photos" in mem
                      ? (m) => openEdit(m)
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Stories Teaser Strip */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/5 via-zinc-100/50 to-indigo-500/5 dark:from-amber-500/[0.03] dark:via-zinc-900/40 dark:to-indigo-500/[0.03] border border-black/5 dark:border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg font-serif font-medium text-zinc-900 dark:text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-amber-500" />
              Cinematic Memory Stories
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Auto-compiled narrative journeys through your travels and seasons
            </p>
          </div>
          <Link
            href="/stories"
            className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            Explore all stories <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_STORIES.map((story) => (
            <Link
              key={story.id}
              href="/stories"
              className="group relative rounded-2xl overflow-hidden aspect-[16/10] bg-zinc-900 border border-black/5 dark:border-white/10 p-4 flex flex-col justify-end shadow-sm hover:shadow-lg transition-all"
            >
              <Image
                src={story.coverImage}
                alt={story.title}
                fill
                className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                  {story.readTime}
                </span>
                <h4 className="text-sm font-serif font-medium text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {story.title}
                </h4>
                <p className="text-[11px] text-zinc-300 line-clamp-1">
                  {story.memoryCount} moments preserved
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
