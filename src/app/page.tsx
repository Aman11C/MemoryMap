"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  ArrowRight,
  MapPin,
  Clock,
  Search,
  Film,
  Users,
  Calendar,
  ShieldCheck,
  Upload,
  Layers,
  Sparkles,
  Heart,
  Eye,
  CheckCircle2,
  Lock,
  ChevronDown,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { MOCK_MEMORIES } from "@/lib/mock-data";
import { useAuth } from "@/context/auth-context";

export default function LandingPage() {
  const { user } = useAuth();
  const featured = MOCK_MEMORIES[0];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#07080b] text-zinc-900 dark:text-zinc-100 selection:bg-amber-500/20 selection:text-amber-700 dark:selection:text-amber-300">
      {/* ─── STICKY NAVIGATION BAR ────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 border-b border-black/5 dark:border-white/10 bg-white/75 dark:bg-[#07080b]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-serif font-medium text-lg tracking-tight text-zinc-900 dark:text-white">
              MemoryMap
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <a
              href="#how-it-works"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#privacy"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Privacy
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {!user ? (
              <Link
                href="/login"
                className="hidden sm:inline-flex text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors px-3 py-1.5"
              >
                Sign In
              </Link>
            ) : null}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-medium hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              <span>{user ? "Open Dashboard" : "Launch App"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 1. HERO SECTION ──────────────────────────────────────────── */}
      <section className="relative pt-20 sm:pt-28 pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            A Private Visual Atlas for Your Life
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light tracking-tight text-zinc-900 dark:text-white leading-[1.08]">
            Your life.
            <br />
            <span className="italic font-normal bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 dark:from-amber-200 dark:via-amber-400 dark:to-orange-300 bg-clip-text text-transparent">
              Beautifully remembered.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
            MemoryMap transforms your photos into a searchable map of the moments,
            places and people that matter.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-medium text-sm hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-black/10 dark:shadow-amber-500/10"
            >
              <span>Start Mapping Memories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 font-medium text-sm transition-all border border-black/5 dark:border-white/10"
            >
              <span>See How It Works</span>
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            </a>
          </div>
        </div>

        {/* ─── ATTRACTIVE VISUAL PREVIEW ──────────────────────────────── */}
        <div className="max-w-6xl mx-auto mt-16 sm:mt-20 relative z-10">
          <div className="rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-black/5 to-transparent dark:from-white/10 dark:to-transparent border border-black/10 dark:border-white/10 shadow-2xl backdrop-blur-2xl">
            {/* Mock Application Window Header */}
            <div className="flex items-center justify-between pb-3 px-2 border-b border-black/5 dark:border-white/10 mb-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
                <span className="ml-3 font-mono text-[11px] text-zinc-400 hidden sm:inline">
                  memorymap.internal / vault / explore
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11px]">
                  <Lock className="w-3 h-3 text-emerald-500" /> End-to-End Encrypted
                </span>
              </div>
            </div>

            {/* Interactive Visual Preview Grid (Photos, Timeline, Map Markers, Memory Cards) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left / Main: Featured Memory Card Preview (7 cols) */}
              <div className="lg:col-span-7 relative rounded-2xl overflow-hidden min-h-[340px] sm:min-h-[420px] bg-zinc-900 border border-white/10 group shadow-lg flex flex-col justify-end p-6">
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Floating Map Marker on Image */}
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/20 flex items-center gap-1.5 shadow-lg">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>36.1578° N, 121.6721° W • McWay Falls</span>
                </div>

                <div className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-rose-400 border border-white/10 backdrop-blur-md">
                  <Heart className="w-4 h-4 fill-current" />
                </div>

                <div className="relative z-10 space-y-2">
                  <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                    {featured.date}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif text-white font-medium">
                    {featured.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 font-serif italic max-w-md line-clamp-2">
                    &ldquo;{featured.description}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 pt-2 text-xs text-zinc-300 border-t border-white/15">
                    <span>With Maya Lin & Julian Vance</span>
                    <span>•</span>
                    <span className="font-mono text-amber-300">Leica Q2 • 28mm</span>
                  </div>
                </div>
              </div>

              {/* Right: Map & Timeline Preview widgets (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Simulated Interactive Map Card */}
                <div className="relative rounded-2xl overflow-hidden p-4 bg-zinc-950 border border-black/10 dark:border-white/10 shadow-sm flex-1 min-h-[190px] flex flex-col justify-between">
                  {/* Subtle Cartographic Pattern */}
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                      backgroundSize: "24px 24px",
                    }}
                  />

                  {/* Header */}
                  <div className="relative z-10 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1 font-serif">
                      <Compass className="w-3.5 h-3.5 text-amber-400" /> Memory Map
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      28 Pins Active
                    </span>
                  </div>

                  {/* Simulated Map Pins */}
                  <div className="relative z-10 py-6 flex items-center justify-around">
                    {[
                      { name: "Kyoto", count: "78", active: true },
                      { name: "Amalfi", count: "62", active: false },
                      { name: "Zermatt", count: "41", active: false },
                    ].map((pin) => (
                      <div key={pin.name} className="flex flex-col items-center gap-1 group">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-110 shadow-md ${
                            pin.active
                              ? "bg-amber-500 border-white text-white shadow-amber-500/40"
                              : "bg-zinc-800 border-amber-400/50 text-amber-300"
                          }`}
                        >
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-medium text-white">
                          {pin.name}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">
                          {pin.count} mems
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Search bar mockup inside map */}
                  <div className="relative z-10 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs text-zinc-300 flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate">Search: &ldquo;Rainy evenings in Kyoto&rdquo;</span>
                  </div>
                </div>

                {/* Simulated Timeline Scrubber Card */}
                <div className="rounded-2xl p-4 bg-white dark:bg-[#11141b] border border-black/10 dark:border-white/10 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                    <span className="flex items-center gap-1.5 font-medium text-zinc-800 dark:text-zinc-200">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> Visual Timeline
                    </span>
                    <span className="font-mono text-[10px]">2023 — 2026</span>
                  </div>

                  {/* Timeline Bar with Dots */}
                  <div className="relative py-2">
                    <div className="h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full w-full" />
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center px-2">
                      <div className="w-3 h-3 rounded-full bg-zinc-400 ring-2 ring-white dark:ring-zinc-900" />
                      <div className="w-3 h-3 rounded-full bg-zinc-400 ring-2 ring-white dark:ring-zinc-900" />
                      <div className="w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-500/20" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2">
                    <span>Oct 2023 · Maui</span>
                    <span>Nov 2024 · Kyoto</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      Oct 2025 · Big Sur
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. HOW IT WORKS SECTION ──────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-24 px-4 sm:px-6 border-t border-black/5 dark:border-white/5 relative"
      >
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400">
              The Journey of a Memory
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-zinc-900 dark:text-white">
              How it works
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Four seamless steps that take your scattered camera roll and weave it into a living visual history.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                name: "Upload",
                icon: Upload,
                title: "Preserve in RAW",
                description:
                  "Drop in your photos or sync library exports. Every timestamp, GPS coordinate, and camera parameter is preserved with zero compression.",
              },
              {
                step: "02",
                name: "Organize",
                icon: Layers,
                title: "Spatial & Temporal Index",
                description:
                  "Photos are automatically clustered into geographic places, date ranges, and familiar faces without tedious manual tagging.",
              },
              {
                step: "03",
                name: "Explore",
                icon: Compass,
                title: "Glide the Map & Timeline",
                description:
                  "Navigate across interactive global coordinates or glide smoothly down a continuous chronological timeline of your life.",
              },
              {
                step: "04",
                name: "Remember",
                icon: Sparkles,
                title: "Rediscover & Relive",
                description:
                  "Wake up to serendipitous 'On This Day' prompts, cinematic story reels, and instant natural language search.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="p-6 rounded-3xl bg-white dark:bg-[#11141b] border border-black/10 dark:border-white/10 hover:border-amber-500/40 shadow-sm hover:shadow-lg transition-all space-y-4 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">
                      STEP {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-amber-500" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-serif font-medium text-zinc-900 dark:text-white">
                      {item.name}
                    </h3>
                    <div className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-0.5">
                      {item.title}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 3. FEATURES SECTION ──────────────────────────────────────── */}
      <section
        id="features"
        className="py-24 px-4 sm:px-6 bg-zinc-100/50 dark:bg-white/[0.01] border-t border-black/5 dark:border-white/5"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Crafted for Photographers & Dreamers
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-zinc-900 dark:text-white">
              Everything to rediscover your story
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              A bespoke suite of archival and contemplative tools designed with zero clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Interactive Memory Map",
                subtitle: "Cartographic precision",
                description:
                  "View every footstep across continents. Zoom from country-level heat clusters down to the specific café corner where you took a photo.",
                icon: MapPin,
                image:
                  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
              },
              {
                title: "Visual Timeline",
                subtitle: "Seamless chronological thread",
                description:
                  "Scroll through days, seasons, and years along a clean, luminous spine. Relive journeys chronologically as they truly unfolded.",
                icon: Clock,
                image:
                  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
              },
              {
                title: "Natural Language Search",
                subtitle: "Search how your mind recalls",
                description:
                  "Never struggle with folder names again. Search by feelings, places, or companions: 'Rainy evening coffee in Kyoto with Maya'.",
                icon: Search,
                image:
                  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
              },
              {
                title: "Memory Stories",
                subtitle: "Cinematic chapters",
                description:
                  "Automated story generation compiles trips and milestones into immersive, ambient slideshows ready to relive on any screen.",
                icon: Film,
                image:
                  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
              },
              {
                title: "People",
                subtitle: "Faces & relationships",
                description:
                  "Honor the friends, family, and travel partners who gave meaning to your adventures with dedicated relationship vaults.",
                icon: Users,
                image:
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
              },
              {
                title: "On This Day",
                subtitle: "Daily morning serendipity",
                description:
                  "Rediscover forgotten mornings from three, five, or ten years ago. A peaceful daily touchpoint celebrating who you were and where you stood.",
                icon: Calendar,
                image:
                  "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=600&q=80",
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-3xl overflow-hidden bg-white dark:bg-[#11141b] border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    <Image
                      src={f.image}
                      alt={f.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/90 text-white flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono tracking-wide">
                        {f.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-medium text-lg text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {f.title}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2">
                        {f.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 4. PRIVACY SECTION ───────────────────────────────────────── */}
      <section
        id="privacy"
        className="py-24 px-4 sm:px-6 border-t border-black/5 dark:border-white/5 relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Uncompromising Principle
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-zinc-900 dark:text-white">
              Your memories belong to you.
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              We believe a person&apos;s memories are sacred. MemoryMap is built
              with zero advertising, zero data mining, and total local sovereignty.
            </p>
          </div>

          {/* Privacy Guarantee Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
            {[
              {
                icon: Lock,
                title: "Zero Data Mining",
                desc: "Your photos are never used to train public machine learning models or sell advertising profiles.",
              },
              {
                icon: Eye,
                title: "Private Vault",
                desc: "Encrypted at rest with your own master keys. Not even our engineers can view your albums.",
              },
              {
                icon: CheckCircle2,
                title: "Full Export Sovereignty",
                desc: "Download your entire library with raw EXIF metadata and timeline hierarchies anytime in one click.",
              },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="p-5 rounded-2xl bg-white dark:bg-[#11141b] border border-black/10 dark:border-white/10 space-y-2 shadow-sm"
                >
                  <Icon className="w-5 h-5 text-amber-500" />
                  <h4 className="font-serif font-medium text-sm text-zinc-900 dark:text-white">
                    {p.title}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 5. FINAL CTA SECTION ─────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 relative border-t border-black/5 dark:border-white/5 bg-gradient-to-b from-transparent to-amber-500/5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-zinc-900 dark:text-white leading-tight">
            Begin mapping the moments
            <br />
            <span className="italic text-amber-600 dark:text-amber-400 font-normal">
              that define your life.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
            Experience the calm, photographic sanctuary for your visual history.
          </p>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-medium text-sm hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-black/10 dark:shadow-amber-500/10"
            >
              <span>Start Mapping Memories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 6. FOOTER ────────────────────────────────────────────────── */}
      <footer className="py-12 px-4 sm:px-8 border-t border-black/10 dark:border-white/10 text-xs text-zinc-500 dark:text-zinc-400 bg-white/50 dark:bg-[#07080b]/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-sm">
              <Compass className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-serif font-medium text-zinc-900 dark:text-white text-sm">
              MemoryMap
            </span>
            <span className="text-zinc-400 ml-2">
              © {new Date().getFullYear()} MemoryMap. All rights reserved.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-white">
              Dashboard
            </Link>
            <Link href="/memories" className="hover:text-zinc-900 dark:hover:text-white">
              Memories
            </Link>
            <Link href="/timeline" className="hover:text-zinc-900 dark:hover:text-white">
              Timeline
            </Link>
            <Link href="/map" className="hover:text-zinc-900 dark:hover:text-white">
              Map
            </Link>
            <Link href="/people" className="hover:text-zinc-900 dark:hover:text-white">
              People
            </Link>
            <Link href="/stories" className="hover:text-zinc-900 dark:hover:text-white">
              Stories
            </Link>
            <a href="#privacy" className="hover:text-zinc-900 dark:hover:text-white">
              Privacy Promise
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
