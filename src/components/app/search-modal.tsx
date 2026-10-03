"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, X, MapPin, Calendar, Film, ArrowRight } from "lucide-react";
import { MOCK_MEMORIES, MOCK_PLACES, MOCK_PEOPLE, MOCK_STORIES } from "@/lib/mock-data";
import Link from "next/link";
import Image from "next/image";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMemory?: (id: string) => void;
}

export function SearchModal({ isOpen, onClose, onSelectMemory }: SearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Handled externally if needed
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return {
        memories: MOCK_MEMORIES.slice(0, 3),
        places: MOCK_PLACES.slice(0, 3),
        people: MOCK_PEOPLE.slice(0, 3),
        stories: MOCK_STORIES.slice(0, 2),
      };
    }

    return {
      memories: MOCK_MEMORIES.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.locationName.toLowerCase().includes(q) ||
          m.city.toLowerCase().includes(q) ||
          m.country.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      ),
      places: MOCK_PLACES.filter(
        (p) => p.name.toLowerCase().includes(q) || p.country.toLowerCase().includes(q)
      ),
      people: MOCK_PEOPLE.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.relationship.toLowerCase().includes(q)
      ),
      stories: MOCK_STORIES.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.subtitle.toLowerCase().includes(q) ||
          s.places.some((pl) => pl.toLowerCase().includes(q))
      ),
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md transition-all">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#11141a] rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-black/10 dark:border-white/10 gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search memories, locations, people, or stories... (e.g., 'Kyoto', 'Maya', 'Pacific')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-0 outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 text-base"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 rounded border border-black/5 dark:border-white/5">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-6 flex-1 text-sm">
          {/* Quick Suggestions / Memories */}
          {filteredResults.memories.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 px-2">
                <span>Memories ({filteredResults.memories.length})</span>
                <Link
                  href="/memories"
                  onClick={onClose}
                  className="hover:text-amber-500 flex items-center gap-1 normal-case tracking-normal"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-1">
                {filteredResults.memories.map((memory) => (
                  <button
                    key={memory.id}
                    onClick={() => {
                      if (onSelectMemory) onSelectMemory(memory.id);
                      onClose();
                    }}
                    className="w-full text-left flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors group"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-zinc-200 dark:bg-zinc-800">
                      <Image
                        src={memory.coverImage}
                        alt={memory.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {memory.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {memory.locationName}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {memory.date}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Places */}
          {filteredResults.places.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 px-2">
                Places
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredResults.places.map((place) => (
                  <Link
                    key={place.id}
                    href={`/map?place=${encodeURIComponent(place.name)}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {place.name}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {place.memoryCount} memories preserved
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* People */}
          {filteredResults.people.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 px-2">
                People
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredResults.people.map((person) => (
                  <Link
                    key={person.id}
                    href={`/people`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-black/10 dark:border-white/10">
                      <Image
                        src={person.avatar}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {person.name}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {person.relationship} • {person.memoryCount} moments
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Stories */}
          {filteredResults.stories.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 px-2">
                Stories
              </div>
              <div className="space-y-1">
                {filteredResults.stories.map((story) => (
                  <Link
                    key={story.id}
                    href="/stories"
                    onClick={onClose}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                      <Film className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {story.title}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {story.subtitle}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {filteredResults.memories.length === 0 &&
            filteredResults.places.length === 0 &&
            filteredResults.people.length === 0 &&
            filteredResults.stories.length === 0 && (
              <div className="py-12 text-center text-zinc-400">
                <Search className="w-8 h-8 mx-auto mb-2 stroke-1 text-zinc-400" />
                <p className="font-medium text-zinc-600 dark:text-zinc-300">
                  No memories match &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Try searching by location name, city, tag, or companion name.
                </p>
              </div>
            )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-zinc-50 dark:bg-[#0c0e13] border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px]">
                ↑↓
              </kbd>{" "}
              to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px]">
                ↵
              </kbd>{" "}
              to select
            </span>
          </div>
          <span>Natural Language Search</span>
        </div>
      </div>
    </div>
  );
}
