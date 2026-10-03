"use client";

import { useState } from "react";
import { X, Check, Loader2, MapPin, Calendar, Compass, Smile, Tag, Edit3 } from "lucide-react";
import { DatabaseMemory, updateMemory } from "@/lib/services/memory-service";

interface MemoryEditModalProps {
  memory: DatabaseMemory | null;
  isOpen: boolean;
  onClose: () => void;
  onMemoryUpdated: () => void;
}

export function MemoryEditModal({
  memory,
  isOpen,
  onClose,
  onMemoryUpdated,
}: MemoryEditModalProps) {
  const [title, setTitle] = useState(memory?.title || "");
  const [description, setDescription] = useState(memory?.description || "");
  const [date, setDate] = useState(memory?.date || "");
  const [locationName, setLocationName] = useState(memory?.location_name || "");
  const [activity, setActivity] = useState(memory?.activity || "Travel");
  const [mood, setMood] = useState(memory?.mood || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(memory?.tags || []);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !memory) return null;

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

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Title is required.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const res = await updateMemory(memory.id, {
      title: title.trim(),
      description: description.trim(),
      date,
      locationName: locationName.trim(),
      activity,
      mood: mood.trim(),
      tags,
    });

    setIsSaving(false);
    if (res.success) {
      onMemoryUpdated();
      onClose();
    } else {
      setErrorMessage(res.error || "Failed to update memory.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-xl bg-white dark:bg-[#11141b] rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/10">
          <h3 className="font-serif font-medium text-base text-zinc-900 dark:text-white flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-amber-500" />
            Edit Memory
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 text-xs">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-500" /> Location
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-500" /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                <Compass className="w-3 h-3 text-zinc-400" /> Activity
              </label>
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                <Smile className="w-3 h-3 text-zinc-400" /> Mood
              </label>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-zinc-400" /> Tags
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs bg-amber-500/10 text-amber-700 dark:text-amber-300"
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
                className="flex-1 min-w-[80px] bg-transparent text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none p-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/5 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-medium text-xs hover:opacity-90 transition-opacity"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
