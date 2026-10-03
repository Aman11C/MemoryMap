"use client";

import { useState } from "react";
import { Users, Heart, MapPin, Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import { MOCK_PEOPLE, MOCK_MEMORIES } from "@/lib/mock-data";
import { useMemoryContext } from "@/context/memory-context";

export default function PeoplePage() {
  const { openMemoryDetail } = useMemoryContext();
  const [selectedPersonId, setSelectedPersonId] = useState<string>(MOCK_PEOPLE[0].id);

  const selectedPerson =
    MOCK_PEOPLE.find((p) => p.id === selectedPersonId) || MOCK_PEOPLE[0];

  const personMemories = MOCK_MEMORIES.filter((m) =>
    m.people.some((p) => p.id === selectedPerson.id)
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
          <Users className="w-3.5 h-3.5" /> Relationship Vault
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-light text-zinc-900 dark:text-white">
          People
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          The faces, laughter, and companions who shaped your visual journey
        </p>
      </div>

      {/* People Portrait Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {MOCK_PEOPLE.map((person) => {
          const isSelected = person.id === selectedPersonId;
          return (
            <button
              key={person.id}
              onClick={() => setSelectedPersonId(person.id)}
              className={`p-4 rounded-3xl text-center transition-all duration-300 flex flex-col items-center group relative border ${
                isSelected
                  ? "bg-white dark:bg-[#151922] border-amber-500/50 shadow-md ring-2 ring-amber-500/20"
                  : "bg-white/60 dark:bg-[#11141b]/60 border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/15"
              }`}
            >
              <div
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-3 border-2 transition-transform duration-300 group-hover:scale-105 ${
                  isSelected
                    ? "border-amber-500 shadow-md shadow-amber-500/20"
                    : "border-black/10 dark:border-white/10"
                }`}
              >
                <Image
                  src={person.avatar}
                  alt={person.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              <div className="font-serif font-medium text-sm text-zinc-900 dark:text-white truncate w-full">
                {person.name}
              </div>

              <div className="text-[11px] text-zinc-400 mt-0.5 truncate w-full">
                {person.relationship}
              </div>

              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-zinc-100 dark:bg-white/[0.04] text-zinc-500 dark:text-zinc-400">
                {person.memoryCount} moments
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Person Spotlight & Their Memories */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#11141b] border border-black/10 dark:border-white/10 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500 shrink-0">
              <Image
                src={selectedPerson.avatar}
                alt={selectedPerson.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-serif text-zinc-900 dark:text-white">
                  Moments shared with {selectedPerson.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium">
                  {selectedPerson.relationship}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Preserved across {selectedPerson.memoryCount} shared photographs and road trips
              </p>
            </div>
          </div>
        </div>

        {/* Memories Grid for Selected Person */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {personMemories.map((mem) => (
            <div
              key={mem.id}
              onClick={() => openMemoryDetail(mem.id)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-zinc-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-amber-500/40 transition-all flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                <Image
                  src={mem.coverImage}
                  alt={mem.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 text-[11px] font-medium text-white flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {mem.city}
                </div>
                {mem.isFavorite && (
                  <div className="absolute top-2.5 right-2.5 p-1 rounded-full bg-black/40 text-rose-400">
                    <Heart className="w-3 h-3 fill-current" />
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400 mb-1">
                    <Calendar className="w-3 h-3" /> {mem.date}
                  </div>
                  <h4 className="font-serif font-medium text-sm text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-1">
                    {mem.title}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1">
                    {mem.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>{mem.category}</span>
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium group-hover:translate-x-1 transition-transform">
                    View memory <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
