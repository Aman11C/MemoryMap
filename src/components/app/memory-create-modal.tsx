"use client";

import { useState, useRef, useCallback } from "react";
import {
  X,
  Upload,
  MapPin,
  Calendar,
  Sparkles,
  Tag,
  Users,
  Compass,
  Smile,
  Check,
  Loader2,
  Trash2,
  Info,
} from "lucide-react";
import Image from "next/image";
import { extractPhotoMetadata, ExtractedPhotoMetadata } from "@/lib/exif";
import { createMemoryWithPhotos } from "@/lib/services/memory-service";
import { useAuth } from "@/context/auth-context";

interface PhotoPreviewItem {
  id: string;
  file: File;
  previewUrl: string;
  exif: ExtractedPhotoMetadata | null;
}

interface MemoryCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemoryCreated: () => void;
}

export function MemoryCreateModal({
  isOpen,
  onClose,
  onMemoryCreated,
}: MemoryCreateModalProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Photos State
  const [photoItems, setPhotoItems] = useState<PhotoPreviewItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [activity, setActivity] = useState("Travel");
  const [mood, setMood] = useState("Adventurous");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(["travel", "moments"]);
  const [peopleInput, setPeopleInput] = useState("");
  const [people, setPeople] = useState<string[]>([]);

  // Metadata Extraction Notice
  const [exifBadge, setExifBadge] = useState<string | null>(null);

  // Upload progress state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Process newly selected files
  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/heic",
        "image/heif",
      ];

      const newItems: PhotoPreviewItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Allow common images
        if (
          validTypes.includes(file.type.toLowerCase()) ||
          /\.(jpg|jpeg|png|webp|heic|heif)$/i.test(file.name)
        ) {
          const previewUrl = URL.createObjectURL(file);
          const exif = await extractPhotoMetadata(file);

          newItems.push({
            id: `${Date.now()}-${Math.random()}`,
            file,
            previewUrl,
            exif,
          });

          // Auto-fill from the first photo that has metadata if user hasn't typed yet
          if (i === 0 || !locationName) {
            if (exif.captureDate) {
              setDate(exif.captureDate);
            }
            if (exif.latitude !== null && exif.longitude !== null) {
              setLatitude(exif.latitude);
              setLongitude(exif.longitude);
              setExifBadge(`📍 GPS: ${exif.latitude.toFixed(4)}°, ${exif.longitude.toFixed(4)}°`);
            } else if (exif.captureDate) {
              setExifBadge(`📅 Date detected: ${exif.captureDate}`);
            }
          }
        }
      }

      setPhotoItems((prev) => [...prev, ...newItems]);
    },
    [locationName]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemovePhoto = (id: string) => {
    setPhotoItems((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, "");
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddPerson = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = peopleInput.trim();
      if (val && !people.includes(val)) {
        setPeople([...people, val]);
        setPeopleInput("");
      }
    }
  };

  const handleRemovePerson = (personToRemove: string) => {
    setPeople(people.filter((p) => p !== personToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Please give this memory a title.");
      return;
    }
    if (photoItems.length === 0) {
      setErrorMessage("Please select at least one photograph for this memory.");
      return;
    }

    if (!user) {
      setErrorMessage("You must be signed in to preserve memories.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setUploadProgress(5);
    setUploadStatusText("Initializing memory vault...");

    const filesToUpload = photoItems.map((p) => p.file);

    const result = await createMemoryWithPhotos({
      userId: user.id,
      title: title.trim(),
      description: description.trim(),
      date,
      locationName: locationName.trim(),
      latitude,
      longitude,
      activity,
      mood,
      tags,
      peopleNames: people,
      photoFiles: filesToUpload,
      onProgress: (progress, text) => {
        setUploadProgress(progress);
        setUploadStatusText(text);
      },
    });

    if (result.success) {
      setTimeout(() => {
        setIsSubmitting(false);
        onMemoryCreated();
        onClose();
        // Reset form
        setTitle("");
        setDescription("");
        setLocationName("");
        setPhotoItems([]);
        setTags(["travel", "moments"]);
        setPeople([]);
        setExifBadge(null);
      }, 500);
    } else {
      setIsSubmitting(false);
      setErrorMessage(result.error || "Failed to create memory. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md transition-all overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#11141b] rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/10 bg-zinc-50/50 dark:bg-white/[0.02]">
          <div>
            <h3 className="text-lg font-serif font-medium text-zinc-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Capture New Memory
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Drop photos, extract optical metadata, and archive to your vault
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-sm">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ─── UPLOAD DROP ZONE ──────────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Photographs ({photoItems.length} selected)
              </label>
              <span className="text-[11px] text-zinc-400">JPG, PNG, WEBP, HEIC</span>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-amber-500 bg-amber-500/[0.05]"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 hover:bg-amber-500/[0.02]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) processFiles(e.target.files);
                }}
              />
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-white/[0.05] text-amber-500 flex items-center justify-center mx-auto mb-2">
                <Upload className="w-6 h-6 stroke-[1.8]" />
              </div>
              <p className="font-medium text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                Drag &amp; drop photos here, or click to browse
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">
                EXIF capture timestamps and coordinates are automatically extracted
              </p>
            </div>

            {/* Selected Photos Thumbnails List */}
            {photoItems.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {photoItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative group rounded-2xl overflow-hidden aspect-square border border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800 shadow-sm"
                  >
                    <Image
                      src={item.previewUrl}
                      alt={item.file.name}
                      fill
                      className="object-cover"
                      sizes="140px"
                    />

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePhoto(item.id);
                      }}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 hover:bg-rose-600 text-white backdrop-blur-md transition-colors"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Metadata badge */}
                    {item.exif?.latitude && (
                      <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/70 text-amber-300 backdrop-blur-sm">
                        📍 GPS
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {exifBadge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{exifBadge}</span>
              </div>
            )}
          </div>

          {/* ─── MEMORY DETAILS ─────────────────────────────────────── */}
          <div className="space-y-4 pt-2 border-t border-black/5 dark:border-white/5">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Memory Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. First College Trip or Sunset at Positano"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" /> Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jaipur, Rajasthan"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" /> Date Taken
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>

            {/* Activity & Mood */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-zinc-400" /> Activity
                </label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-[#151821] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  <option value="Travel">Travel &amp; Exploration</option>
                  <option value="Road Trip">Road Trip</option>
                  <option value="Hiking">Hiking &amp; Outdoors</option>
                  <option value="Celebration">Celebration &amp; Milestone</option>
                  <option value="Family">Family Gathering</option>
                  <option value="College">College &amp; Friends</option>
                  <option value="Everyday">Everyday Serendipity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-zinc-400" /> Mood / Vibe
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nostalgic, Adventurous, Serene"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Story / Narrative Note
              </label>
              <textarea
                rows={3}
                placeholder="What made this moment unforgettable? The scent of the air, who was there, what happened..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none leading-relaxed"
              />
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-zinc-400" /> Tags (press Enter or comma)
              </label>
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs bg-amber-500/10 text-amber-700 dark:text-amber-300"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-rose-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="flex-1 min-w-[100px] bg-transparent text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none p-1"
                />
              </div>
            </div>

            {/* People Input */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-zinc-400" /> People Tagged (press Enter)
              </label>
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10">
                {people.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium"
                  >
                    {p}
                    <button
                      type="button"
                      onClick={() => handleRemovePerson(p)}
                      className="hover:text-rose-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Add person name (e.g. Maya, Arjun)..."
                  value={peopleInput}
                  onChange={(e) => setPeopleInput(e.target.value)}
                  onKeyDown={handleAddPerson}
                  className="flex-1 min-w-[140px] bg-transparent text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none p-1"
                />
              </div>
            </div>
          </div>

          {/* Upload Progress Bar */}
          {isSubmitting && (
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/[0.04] space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-zinc-700 dark:text-zinc-300">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                  {uploadStatusText}
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/5 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || photoItems.length === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-medium text-xs hover:opacity-90 active:scale-95 transition-all shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Archiving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Preserve Memory</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
