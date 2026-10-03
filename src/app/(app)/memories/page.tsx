"use client";

import { useState, useMemo } from "react";
import {
  Images,
  LayoutGrid,
  List,
  Search,
  Plus,
  Compass,
  Sparkles,
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";
import { useMemoryContext } from "@/context/memory-context";
import { MemoryCard } from "@/components/app/memory-card";
import { MemoryEmptyState } from "@/components/app/memory-empty-state";
import { DatabaseMemory, deleteMemory } from "@/lib/services/memory-service";

export default function MemoriesPage() {
  const {
    dbMemories,
    mockMemories,
    showDemoData,
    toggleShowDemoData,
    openMemoryDetail,
    openCreate,
    openEdit,
    refreshMemories,
    isLoading,
  } = useMemoryContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Delete Confirmation Dialog state
  const [memoryToDelete, setMemoryToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Active pool of memories
  const memoriesSource = useMemo(() => {
    if (dbMemories.length > 0) return dbMemories;
    if (showDemoData) return mockMemories;
    return [];
  }, [dbMemories, showDemoData, mockMemories]);

  // Filtered memories based on search and activity
  const filteredMemories = useMemo(() => {
    return memoriesSource.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const isDb = "photos" in m;

      // Activity filter
      const activityVal = (isDb ? (m as DatabaseMemory).activity : (m as { category?: string }).category) || "";
      if (
        selectedActivity !== "all" &&
        activityVal.toLowerCase() !== selectedActivity.toLowerCase()
      ) {
        return false;
      }

      // Search query filter
      if (!q) return true;

      const titleMatch = m.title.toLowerCase().includes(q);
      const descMatch = m.description?.toLowerCase().includes(q);
      const locMatch = isDb
        ? (m as DatabaseMemory).location_name?.toLowerCase().includes(q)
        : (m as { locationName?: string }).locationName?.toLowerCase().includes(q);
      const tagsMatch = m.tags?.some((t) => t.toLowerCase().includes(q));

      return Boolean(titleMatch || descMatch || locMatch || tagsMatch);
    });
  }, [memoriesSource, searchQuery, selectedActivity]);

  const confirmDelete = async () => {
    if (!memoryToDelete) return;
    setIsDeleting(true);
    await deleteMemory(memoryToDelete);
    setIsDeleting(false);
    setMemoryToDelete(null);
    refreshMemories();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            <Images className="w-3.5 h-3.5" /> Photographic Vault
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-light text-zinc-900 dark:text-white">
            Memories
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {dbMemories.length > 0
              ? `${dbMemories.length} real moments stored in your private database`
              : showDemoData
              ? `Displaying ${mockMemories.length} demo moments (Archive mode)`
              : "Your personal encrypted memory archive"}
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

          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-medium text-xs sm:text-sm hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Memory
          </button>
        </div>
      </div>

      {/* Filter and View Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 rounded-2xl bg-white dark:bg-[#11141b] border border-black/10 dark:border-white/10 shadow-sm">
        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Filter by title, place, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-white/[0.04] border border-black/5 dark:border-white/5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
          />
        </div>

        {/* Activity Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All" },
            { id: "travel", label: "Travel" },
            { id: "road trip", label: "Road Trips" },
            { id: "hiking", label: "Hiking" },
            { id: "celebration", label: "Milestones" },
          ].map((act) => (
            <button
              key={act.id}
              onClick={() => setSelectedActivity(act.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                selectedActivity === act.id
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm"
                  : "bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {act.label}
            </button>
          ))}
        </div>

        {/* View Mode Toggle: Grid vs List */}
        <div className="flex items-center border border-black/10 dark:border-white/10 rounded-xl overflow-hidden p-0.5 bg-zinc-100 dark:bg-white/[0.04] shrink-0 self-end md:self-auto">
          <button
            onClick={() => setViewMode("grid")}
            title="Grid View"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            title="Timeline / List View"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── LOADING STATE ────────────────────────────────────────── */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Reading your private memory archive from database...
          </p>
        </div>
      ) : memoriesSource.length === 0 ? (
        /* ─── EMPTY STATE ──────────────────────────────────────────── */
        <MemoryEmptyState
          onOpenCreate={openCreate}
          onLoadDemo={toggleShowDemoData}
        />
      ) : filteredMemories.length === 0 ? (
        /* ─── NO MATCHES SEARCH EMPTY STATE ────────────────────────── */
        <div className="py-16 text-center text-zinc-400 space-y-2">
          <Compass className="w-8 h-8 mx-auto text-zinc-400 stroke-1" />
          <p className="font-serif text-base text-zinc-700 dark:text-zinc-300">
            No memories match your query &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-xs text-zinc-400">
            Try checking for spelling or resetting your activity filter.
          </p>
        </div>
      ) : (
        /* ─── MEMORY GALLERY (GRID OR LIST) ────────────────────────── */
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-3"
          }
        >
          {filteredMemories.map((mem) => (
            <MemoryCard
              key={mem.id}
              memory={mem}
              viewMode={viewMode}
              onClick={() => openMemoryDetail(mem.id)}
              onEdit={(m) => openEdit(m)}
              onDelete={(id) => setMemoryToDelete(id)}
            />
          ))}
        </div>
      )}

      {/* ─── DELETE CONFIRMATION MODAL ─────────────────────────────── */}
      {memoryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#151821] rounded-3xl p-6 border border-rose-500/20 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-medium text-base text-zinc-900 dark:text-white">
                Delete Memory?
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Are you sure you want to delete this memory and its photos? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setMemoryToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.04]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-medium hover:bg-rose-700 transition-colors"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
