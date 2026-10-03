"use client";

import { useState } from "react";
import { Film, Play, MapPin, X, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { MOCK_STORIES, MOCK_MEMORIES } from "@/lib/mock-data";
import { Story } from "@/lib/types";

export default function StoriesPage() {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const startStory = (story: Story) => {
    setActiveStory(story);
    setSlideIndex(0);
  };

  const closeStory = () => {
    setActiveStory(null);
  };

  const nextSlide = () => {
    if (activeStory) {
      setSlideIndex((prev) => (prev + 1) % MOCK_MEMORIES.length);
    }
  };

  const prevSlide = () => {
    if (activeStory) {
      setSlideIndex((prev) => (prev - 1 + MOCK_MEMORIES.length) % MOCK_MEMORIES.length);
    }
  };

  const currentSlideMemory = MOCK_MEMORIES[slideIndex];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
          <Film className="w-3.5 h-3.5" /> Curated Narratives
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-light text-zinc-900 dark:text-white">
          Memory Stories
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Cinematic chapters compiled from your photographs, ambient audio, and journeys
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_STORIES.map((story) => (
          <div
            key={story.id}
            className="group rounded-3xl overflow-hidden bg-white dark:bg-[#11141b] border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Visual Cover */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
              <Image
                src={story.coverImage}
                alt={story.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Read Time & Play Button pill */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-md text-amber-300 border border-white/10 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {story.readTime}
              </div>

              <button
                onClick={() => startStory(story)}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]"
                aria-label={`Play story ${story.title}`}
              >
                <div className="w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                  {story.dateRange}
                </div>
                <h3 className="text-xl sm:text-2xl font-serif leading-tight">
                  {story.title}
                </h3>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-serif leading-relaxed italic">
                &ldquo;{story.summary}&rdquo;
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/5 dark:border-white/5">
                <span className="text-xs text-zinc-400 font-medium">Regions:</span>
                {story.places.map((place) => (
                  <span
                    key={place}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400"
                  >
                    <MapPin className="w-3 h-3 text-amber-500" />
                    {place}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">
                  {story.memoryCount} moments captured
                </span>
                <button
                  onClick={() => startStory(story)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-medium text-xs hover:opacity-90 transition-opacity"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Relive Story
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cinematic Full-Screen Story Player Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in duration-300">
          {/* Top Bar */}
          <div className="w-full max-w-4xl flex items-center justify-between text-white z-20">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-amber-400">
                Playing Story • {activeStory.title}
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                Slide {slideIndex + 1} of {MOCK_MEMORIES.length}
              </div>
            </div>

            <button
              onClick={closeStory}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
              aria-label="Close story"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Cinematic Photo Canvas */}
          <div className="relative w-full max-w-4xl flex-1 flex flex-col justify-end p-6 sm:p-10 rounded-3xl overflow-hidden my-4">
            <Image
              src={currentSlideMemory.coverImage}
              alt={currentSlideMemory.title}
              fill
              priority
              className="object-contain"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-2 text-white max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-amber-300 font-mono">
                <MapPin className="w-3.5 h-3.5" />
                {currentSlideMemory.locationName} • {currentSlideMemory.date}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif leading-tight">
                {currentSlideMemory.title}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 font-serif italic line-clamp-2">
                &ldquo;{currentSlideMemory.description}&rdquo;
              </p>
            </div>
          </div>

          {/* Bottom Player Controls */}
          <div className="w-full max-w-4xl flex items-center justify-between text-white z-20 pt-2">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous memory slide"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Slide progress bars */}
            <div className="flex items-center gap-1.5 flex-1 max-w-md mx-4">
              {MOCK_MEMORIES.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    i === slideIndex
                      ? "bg-amber-400"
                      : i < slideIndex
                      ? "bg-white/60"
                      : "bg-white/20"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next memory slide"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
