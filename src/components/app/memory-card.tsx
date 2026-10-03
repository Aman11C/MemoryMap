"use client";

import { MapPin, Calendar, Tag, MoreVertical, Edit3, Trash2, Images } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { DatabaseMemory } from "@/lib/services/memory-service";
import { Memory } from "@/lib/types";

interface MemoryCardProps {
  memory: DatabaseMemory | Memory;
  onClick: () => void;
  onEdit?: (memory: DatabaseMemory) => void;
  onDelete?: (memoryId: string) => void;
  viewMode?: "grid" | "list";
}

export function MemoryCard({
  memory,
  onClick,
  onEdit,
  onDelete,
  viewMode = "grid",
}: MemoryCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isDb = "photos" in memory && Array.isArray((memory as DatabaseMemory).photos);
  const dbMem = isDb ? (memory as DatabaseMemory) : null;

  // Cover photo
  let coverPhotoUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";
  let photoCount = 1;

  if (isDb && dbMem) {
    if (dbMem.photos.length > 0 && dbMem.photos[0].image_url) {
      coverPhotoUrl = dbMem.photos[0].image_url;
    }
    photoCount = dbMem.photos.length;
  } else {
    coverPhotoUrl = (memory as Memory).coverImage || coverPhotoUrl;
    photoCount = (memory as Memory).images?.length || 1;
  }

  const tags = isDb ? dbMem!.tags || [] : (memory as Memory).tags || [];
  const location = isDb ? dbMem!.location_name : (memory as Memory).locationName || (memory as Memory).city;

  if (viewMode === "list") {
    return (
      <div
        onClick={onClick}
        className="group cursor-pointer rounded-2xl p-3 sm:p-4 bg-white dark:bg-[#11141b] border border-black/10 dark:border-white/10 hover:border-amber-500/40 transition-all flex items-center gap-4 shadow-sm hover:shadow-md"
      >
        <div className="relative w-20 sm:w-28 h-20 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-zinc-200 dark:bg-zinc-800">
          <Image
            src={coverPhotoUrl}
            alt={memory.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="120px"
          />
          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/60 text-white backdrop-blur-sm">
            {photoCount}
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-500" /> {memory.date}
            </span>
            {location && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-amber-500" /> {location}
                </span>
              </>
            )}
          </div>

          <h3 className="font-serif font-medium text-base text-zinc-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">
            {memory.title}
          </h3>

          {memory.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
              {memory.description}
            </p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-white/[0.04] text-zinc-500 dark:text-zinc-400"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-3xl overflow-hidden bg-white dark:bg-[#11141b] border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
        <Image
          src={coverPhotoUrl}
          alt={memory.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Location pill */}
        {location && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/50 backdrop-blur-md text-white border border-white/10 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span className="truncate max-w-[130px]">{location}</span>
          </div>
        )}

        {/* Photo count badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/50 backdrop-blur-md text-white border border-white/10 flex items-center gap-1">
          <Images className="w-3 h-3 text-amber-400" />
          <span>{photoCount} photo{photoCount > 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-500" /> {memory.date}
            </span>
            {isDb && dbMem?.activity && (
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/[0.04]">
                {dbMem.activity}
              </span>
            )}
          </div>

          <h3 className="font-serif font-medium text-lg text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
            {memory.title}
          </h3>

          {memory.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {memory.description}
            </p>
          )}
        </div>

        {/* Tags Row */}
        <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
          <div className="flex flex-wrap gap-1 overflow-hidden">
            {tags.length > 0 ? (
              tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-[10px] bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400"
                >
                  <Tag className="w-2.5 h-2.5 text-zinc-400" />
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-zinc-400">Memories vault</span>
            )}
          </div>

          {/* Quick Context Menu */}
          {isDb && (onEdit || onDelete) && (
            <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 bottom-full mb-1 w-32 p-1 rounded-xl bg-white dark:bg-[#1a1e28] border border-black/10 dark:border-white/10 shadow-xl z-30 text-xs">
                    {onEdit && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onEdit(dbMem!);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/[0.05] flex items-center gap-2 text-zinc-700 dark:text-zinc-300"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onDelete(memory.id);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
