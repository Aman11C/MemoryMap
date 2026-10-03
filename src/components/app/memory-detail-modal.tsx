"use client";

import { useEffect, useState } from "react";
import {
  X,
  MapPin,
  Calendar,
  Camera,
  Compass,
  Tag,
  Trash2,
  Edit3,
  AlertTriangle,
  Loader2,
  Smile,
} from "lucide-react";
import Image from "next/image";
import { deleteMemory, deletePhoto, DatabaseMemory } from "@/lib/services/memory-service";
import { Memory } from "@/lib/types";

interface MemoryDetailModalProps {
  memory: DatabaseMemory | Memory | null;
  onClose: () => void;
  onEdit?: (mem: DatabaseMemory) => void;
  onMemoryDeleted?: () => void;
  allMemories?: (DatabaseMemory | Memory)[];
}

export function MemoryDetailModal({
  memory,
  onClose,
  onEdit,
  onMemoryDeleted,
  allMemories = [],
}: MemoryDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDeleteMemory, setConfirmDeleteMemory] = useState(false);
  const [confirmDeletePhotoId, setConfirmDeletePhotoId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!memory) return null;

  // Normalize photo list between DatabaseMemory and Mock Memory
  const isDbMemory = "photos" in memory && Array.isArray((memory as DatabaseMemory).photos);
  const dbMem = isDbMemory ? (memory as DatabaseMemory) : null;

  const photoUrls: string[] = isDbMemory
    ? dbMem!.photos.map((p) => p.image_url)
    : (memory as Memory).images || [(memory as Memory).coverImage];

  const currentImageUrl = photoUrls[activeImageIndex] || photoUrls[0] || "";
  const currentPhotoObj = isDbMemory ? dbMem!.photos[activeImageIndex] : null;

  // Extract companions
  const companions = isDbMemory
    ? dbMem!.people.map((p) => ({
        id: p.id,
        name: p.name,
        relationship: "Companion",
        avatar: p.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      }))
    : (memory as Memory).people || [];

  // Extract tags
  const tagsList = isDbMemory ? dbMem!.tags || [] : (memory as Memory).tags || [];

  // Related memories (same location or activity)
  const relatedMemories = allMemories
    .filter((m) => m.id !== memory.id)
    .slice(0, 2);

  // Handle Delete Memory
  const handleDeleteMemory = async () => {
    if (!isDbMemory) {
      if (onMemoryDeleted) onMemoryDeleted();
      onClose();
      return;
    }

    setIsDeleting(true);
    const res = await deleteMemory(memory.id);
    setIsDeleting(false);

    if (res.success) {
      if (onMemoryDeleted) onMemoryDeleted();
      onClose();
    }
  };

  // Handle Delete Individual Photo
  const handleDeleteCurrentPhoto = async (photoId: string, storagePath: string) => {
    setIsDeleting(true);
    await deletePhoto(photoId, storagePath);
    setIsDeleting(false);
    setConfirmDeletePhotoId(null);
    if (onMemoryDeleted) onMemoryDeleted();
    // Move to previous photo if possible
    setActiveImageIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-full max-h-[92vh] bg-white dark:bg-[#0e1117] rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Top Floating Controls */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {isDbMemory && onEdit && (
            <button
              onClick={() => onEdit(dbMem!)}
              className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
              title="Edit memory"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setConfirmDeleteMemory(true)}
            className="p-2 rounded-full bg-black/50 hover:bg-rose-600 text-white backdrop-blur-md transition-colors"
            title="Delete memory"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─── LEFT: LARGE PHOTO GALLERY ──────────────────────────── */}
        <div className="relative flex-1 bg-black flex flex-col items-center justify-center min-h-[300px] md:min-h-full">
          {currentImageUrl ? (
            <div className="relative w-full h-full min-h-[320px]">
              <Image
                src={currentImageUrl}
                alt={memory.title}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 65vw"
              />
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-500">No photo available</div>
          )}

          {/* Delete Photo Button on current active photo if multiple exist */}
          {isDbMemory && currentPhotoObj && photoUrls.length > 1 && (
            <button
              onClick={() => setConfirmDeletePhotoId(currentPhotoObj.id)}
              className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-full bg-black/60 hover:bg-rose-600 text-white text-[11px] backdrop-blur-md transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete Photo</span>
            </button>
          )}

          {/* Multiple Photo Thumbnails Slider */}
          {photoUrls.length > 1 && (
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent overflow-x-auto">
              {photoUrls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? "border-amber-400 scale-105 shadow-md shadow-amber-500/20"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={url}
                    alt={`Photo ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── RIGHT: MEMORY STORY & DETAILS ──────────────────────── */}
        <div className="w-full md:w-[420px] shrink-0 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-zinc-50/70 dark:bg-[#11141a]/95">
          <div className="space-y-6">
            {/* Badges Row */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                <Compass className="w-3.5 h-3.5" />
                {(isDbMemory ? dbMem?.activity : (memory as Memory).category) || "TRAVEL"}
              </span>

              {isDbMemory && dbMem?.mood && (
                <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <Smile className="w-3.5 h-3.5 text-amber-500" />
                  {dbMem.mood}
                </span>
              )}
            </div>

            {/* Title & Date & Location */}
            <div>
              <h2 className="text-xl md:text-2xl font-serif font-medium tracking-tight text-zinc-900 dark:text-white leading-snug">
                {memory.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  {memory.date}
                </span>
                {(isDbMemory ? dbMem?.location_name : (memory as Memory).locationName) && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      {isDbMemory ? dbMem?.location_name : (memory as Memory).locationName}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Narrative / Description */}
            {memory.description && (
              <div className="prose prose-sm dark:prose-invert text-zinc-600 dark:text-zinc-300 font-serif leading-relaxed text-xs sm:text-sm border-l-2 border-amber-500/40 pl-3.5">
                &ldquo;{memory.description}&rdquo;
              </div>
            )}

            {/* Companions */}
            {companions.length > 0 && (
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  People In This Memory
                </h4>
                <div className="flex flex-wrap gap-2">
                  {companions.map((person) => (
                    <div
                      key={person.id}
                      className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 text-xs text-zinc-800 dark:text-zinc-200"
                    >
                      <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={person.avatar}
                          alt={person.name}
                          fill
                          className="object-cover"
                          sizes="20px"
                        />
                      </div>
                      <span>{person.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical EXIF Specifications */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/5 text-xs space-y-1.5 text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center justify-between font-medium text-zinc-700 dark:text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-500" /> Optical Heritage
                </span>
                <span>
                  {isDbMemory && currentPhotoObj?.metadata?.cameraModel
                    ? String(currentPhotoObj.metadata.cameraModel)
                    : "Preserved RAW Fidelity"}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span>
                  {isDbMemory && currentPhotoObj?.captured_at
                    ? new Date(currentPhotoObj.captured_at).toLocaleDateString()
                    : memory.date}
                </span>
                <span>
                  {isDbMemory && currentPhotoObj?.latitude
                    ? `${currentPhotoObj.latitude.toFixed(2)}° N, ${currentPhotoObj.longitude?.toFixed(2)}° E`
                    : "Coordinates Protected"}
                </span>
              </div>
            </div>

            {/* Tags */}
            {tagsList.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tagsList.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400"
                  >
                    <Tag className="w-3 h-3 text-zinc-400" />
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Related Memories */}
            {relatedMemories.length > 0 && (
              <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Related Memories
                </div>
                <div className="space-y-1.5">
                  {relatedMemories.map((rel) => (
                    <div
                      key={rel.id}
                      className="p-2 rounded-xl bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                        {rel.title}
                      </span>
                      <span className="text-[11px] text-zinc-400 shrink-0 ml-2">
                        {rel.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="text-zinc-400">
              {photoUrls.length} photograph{photoUrls.length > 1 ? "s" : ""}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>

        {/* ─── CONFIRM DELETE MEMORY DIALOG ────────────────────────── */}
        {confirmDeleteMemory && (
          <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-150">
            <div className="w-full max-w-sm bg-white dark:bg-[#151821] rounded-3xl p-6 border border-rose-500/20 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-medium text-base text-zinc-900 dark:text-white">
                  Delete this memory?
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  This will permanently delete &ldquo;{memory.title}&rdquo; and all its archived photographs from your vault.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setConfirmDeleteMemory(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.04]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteMemory}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-medium hover:bg-rose-700 transition-colors"
                >
                  {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>Delete Memory</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── CONFIRM DELETE PHOTO DIALOG ─────────────────────────── */}
        {confirmDeletePhotoId && isDbMemory && currentPhotoObj && (
          <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-150">
            <div className="w-full max-w-sm bg-white dark:bg-[#151821] rounded-3xl p-6 border border-rose-500/20 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-medium text-base text-zinc-900 dark:text-white">
                  Delete photograph?
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Are you sure you want to remove this photo from the memory?
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setConfirmDeletePhotoId(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteCurrentPhoto(currentPhotoObj.id, currentPhotoObj.storage_path)}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-medium hover:bg-rose-700 transition-colors"
                >
                  {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>Delete Photo</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
