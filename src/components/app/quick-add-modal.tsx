"use client";

import { useState } from "react";
import { X, Upload, MapPin, Calendar, Tag, Check, Sparkles } from "lucide-react";
import { MOCK_PEOPLE } from "@/lib/mock-data";
import Image from "next/image";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemoryAdded?: (title: string) => void;
}

export function QuickAddModal({ isOpen, onClose, onMemoryAdded }: QuickAddModalProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("2026-10-03");
  const [selectedPeople, setSelectedPeople] = useState<string[]>([MOCK_PEOPLE[0].id]);
  const [notes, setNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const togglePerson = (id: string) => {
    setSelectedPeople((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      if (onMemoryAdded) {
        onMemoryAdded(title || "New Memory");
      }
      setIsSuccess(false);
      onClose();
      setTitle("");
      setLocation("");
      setNotes("");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all">
      <div className="w-full max-w-xl bg-white dark:bg-[#11141a] rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/10 dark:border-white/10">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Capture New Memory
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Add a moment, place, or photograph to your private visual vault
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-16 px-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Memory Preserved
            </h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              Your memory has been chronologically indexed and anchored to your visual history.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 space-y-5">
            {/* Mock Drag & Drop Photo Area */}
            <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-center hover:border-amber-500/50 hover:bg-amber-500/[0.02] transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-white/[0.05] text-zinc-500 dark:text-zinc-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Drag and drop original photos or click to select
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                EXIF geolocation, timestamp, and camera metadata are automatically parsed
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Memory Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunset over the cliffs of Positano"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" /> Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kyoto, Japan"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" /> Date Taken
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              {/* Tag Companions */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                  With People
                </label>
                <div className="flex flex-wrap gap-2">
                  {MOCK_PEOPLE.map((p) => {
                    const isSelected = selectedPeople.includes(p.id);
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => togglePerson(p.id)}
                        className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs transition-all border ${
                          isSelected
                            ? "bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-300 font-medium"
                            : "bg-zinc-50 dark:bg-white/[0.02] border-black/5 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:border-black/20 dark:hover:border-white/20"
                        }`}
                      >
                        <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={p.avatar}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="16px"
                          />
                        </div>
                        <span>{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Personal Journal / Story Note
                </label>
                <textarea
                  rows={2}
                  placeholder="What made this moment unforgettable? The light, the sound, the feeling..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-medium text-sm hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5"
              >
                <Tag className="w-4 h-4" /> Save Memory
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
