"use client";

import { useState, useMemo } from "react";
import {
  MapPin,
  Compass,
  Search,
  Globe,
  Navigation,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { MOCK_PLACES, MOCK_MEMORIES } from "@/lib/mock-data";
import { useMemoryContext } from "@/context/memory-context";
import { MemoryEmptyState } from "@/components/app/memory-empty-state";
import { DatabaseMemory } from "@/lib/services/memory-service";
import { Memory } from "@/lib/types";

interface DisplayPlace {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  memoryCount: number;
  coverImage: string;
}

export default function MapPage() {
  const {
    dbMemories,
    showDemoData,
    toggleShowDemoData,
    openMemoryDetail,
    openCreate,
  } = useMemoryContext();

  const [searchFilter, setSearchFilter] = useState("");

  // Determine places dynamically
  const places = useMemo<DisplayPlace[]>(() => {
    if (dbMemories.length > 0) {
      const map = new Map<string, DisplayPlace>();

      dbMemories.forEach((m, idx) => {
        const locName = m.location_name?.trim() || "Unspecified Location";
        const key = locName.toLowerCase();

        if (map.has(key)) {
          const existing = map.get(key)!;
          existing.memoryCount += 1;
        } else {
          const coverImg =
            m.photos[0]?.image_url ||
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";

          map.set(key, {
            id: `place-db-${idx}`,
            name: locName,
            country: m.latitude && m.longitude ? "Geotagged" : "Pinned",
            lat: m.latitude || 35.6762,
            lng: m.longitude || 139.6503,
            memoryCount: 1,
            coverImage: coverImg,
          });
        }
      });

      return Array.from(map.values());
    }

    if (showDemoData) {
      return MOCK_PLACES.map((p) => ({
        id: p.id,
        name: p.name,
        country: p.country,
        lat: p.coordinates.lat,
        lng: p.coordinates.lng,
        memoryCount: p.memoryCount,
        coverImage: p.coverImage,
      }));
    }

    return [];
  }, [dbMemories, showDemoData]);

  const [selectedPlaceId, setSelectedPlaceId] = useState<string>("");

  // Update selectedPlace if it changed or became invalid
  const currentSelectedId = selectedPlaceId || places[0]?.id || "";
  const selectedPlace = places.find((p) => p.id === currentSelectedId) || places[0];

  const filteredPlaces = useMemo(() => {
    return places.filter(
      (p) =>
        p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.country.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [places, searchFilter]);

  // Memories belonging to the selected place
  const placeMemories = useMemo(() => {
    if (!selectedPlace) return [];

    if (dbMemories.length > 0) {
      return dbMemories.filter(
        (m) =>
          (m.location_name || "")
            .toLowerCase()
            .includes(selectedPlace.name.toLowerCase()) ||
          selectedPlace.name
            .toLowerCase()
            .includes((m.location_name || "").toLowerCase())
      );
    }

    if (showDemoData) {
      return MOCK_MEMORIES.filter(
        (m) =>
          m.city.toLowerCase().includes(selectedPlace.name.split(",")[0].toLowerCase()) ||
          selectedPlace.name.toLowerCase().includes(m.city.toLowerCase())
      );
    }

    return [];
  }, [selectedPlace, dbMemories, showDemoData]);

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col space-y-4 pb-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-0.5">
            <Compass className="w-3.5 h-3.5" /> Spatial Cartography
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-light text-zinc-900 dark:text-white">
            Memory Map
          </h1>
        </div>

        {/* Status indicator & demo toggle */}
        <div className="flex items-center gap-2.5">
          {dbMemories.length === 0 && (
            <button
              onClick={toggleShowDemoData}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                showDemoData
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
                  : "border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{showDemoData ? "Hide Demo" : "Show Demo Archive"}</span>
            </button>
          )}

          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#11141b] border border-black/10 dark:border-white/10">
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              {places.length} Mapped Locations
            </span>
          </div>
        </div>
      </div>

      {places.length === 0 ? (
        <div className="flex-1 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0e14] p-8 flex items-center justify-center">
          <MemoryEmptyState
            onOpenCreate={openCreate}
            onLoadDemo={toggleShowDemoData}
            showDemo={showDemoData}
          />
        </div>
      ) : (
        /* Main Map Split Interface */
        <div className="flex-1 flex flex-col lg:flex-row rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0e14] shadow-lg min-h-0">
          {/* Left: Places List & Selected Place Details */}
          <div className="w-full lg:w-96 flex flex-col border-b lg:border-b-0 lg:border-r border-black/10 dark:border-white/10 shrink-0 bg-white/80 dark:bg-[#0f1218]/90">
            {/* Search Places */}
            <div className="p-3 border-b border-black/10 dark:border-white/10">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Filter locations..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-white/[0.04] border border-black/5 dark:border-white/5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Places List (Scrollable) */}
            <div className="max-h-48 lg:max-h-56 overflow-y-auto p-2 space-y-1">
              {filteredPlaces.map((place) => {
                const isSelected = place.id === (selectedPlace?.id || currentSelectedId);
                return (
                  <button
                    key={place.id}
                    onClick={() => setSelectedPlaceId(place.id)}
                    className={`w-full text-left flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${
                      isSelected
                        ? "bg-amber-500/10 text-amber-900 dark:text-amber-300 font-semibold border border-amber-500/30"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-amber-500 text-white"
                            : "bg-zinc-100 dark:bg-white/[0.05] text-zinc-400"
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                          {place.name}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-normal">
                          {place.country}
                        </div>
                      </div>
                    </div>

                    <span className="font-mono text-[10px] text-zinc-400 shrink-0 ml-2">
                      {place.memoryCount} mem{place.memoryCount > 1 ? "s" : ""}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Place Detail Panel */}
            {selectedPlace && (
              <div className="p-4 border-t border-black/10 dark:border-white/10 flex-1 overflow-y-auto space-y-3 bg-zinc-50/50 dark:bg-[#11141a]/50">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                  <Image
                    src={selectedPlace.coverImage}
                    alt={selectedPlace.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 360px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 text-white">
                    <div className="text-xs font-serif font-medium">{selectedPlace.name}</div>
                    <div className="text-[10px] text-zinc-300 font-mono">
                      {selectedPlace.lat.toFixed(4)}° N, {selectedPlace.lng.toFixed(4)}° E
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Memories in this region ({placeMemories.length})
                  </div>
                  <div className="space-y-2">
                    {placeMemories.map((mem) => {
                      const isDb = "photos" in mem;
                      const dbM = isDb ? (mem as DatabaseMemory) : null;
                      const coverImg =
                        dbM?.photos[0]?.image_url ||
                        (mem as Memory).coverImage ||
                        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80";

                      return (
                        <div
                          key={mem.id}
                          onClick={() => openMemoryDetail(mem.id)}
                          className="p-2.5 rounded-xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/5 hover:border-amber-500/30 cursor-pointer transition-all flex items-center gap-3 group"
                        >
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-zinc-200 dark:bg-zinc-800">
                            <Image
                              src={coverImg}
                              alt={mem.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate group-hover:text-amber-500 transition-colors">
                              {mem.title}
                            </div>
                            <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                              <span>{mem.date}</span>
                              <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Cartographic Visual Map Canvas */}
          <div className="relative flex-1 bg-[#1a1e28] dark:bg-[#07090e] min-h-[360px] overflow-hidden flex items-center justify-center p-6">
            {/* Subtle cartographic grid styling */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.25) 1px, transparent 0)`,
                backgroundSize: "32px 32px",
              }}
            />

            {/* Compass Rose Ornament */}
            <div className="absolute top-4 right-4 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/60 pointer-events-none hidden sm:block">
              <Navigation className="w-5 h-5 text-amber-400 rotate-45" />
            </div>

            {/* Map Interactive Canvas */}
            <div className="relative w-full max-w-2xl aspect-[16/10] border border-white/10 rounded-3xl p-6 bg-black/30 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none" />

              {/* Pins positioned across canvas */}
              {places.slice(0, 10).map((place, idx) => {
                const isSelected = (selectedPlace?.id || currentSelectedId) === place.id;
                // Calculate pseudo-geographic or fixed percentage positions on canvas
                const xPercent = 15 + ((idx * 27 + (Math.abs(Math.floor(place.lng * 2)) % 65)) % 72);
                const yPercent = 20 + ((idx * 19 + (Math.abs(Math.floor(place.lat * 2)) % 55)) % 60);

                return (
                  <div
                    key={place.id}
                    style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                  >
                    <button
                      onClick={() => setSelectedPlaceId(place.id)}
                      className="relative flex items-center justify-center transition-transform hover:scale-125 focus:outline-none"
                      aria-label={`View memories from ${place.name}`}
                    >
                      {isSelected && (
                        <span className="absolute -inset-2 rounded-full bg-amber-400/30 animate-ping" />
                      )}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all shadow-lg ${
                          isSelected
                            ? "bg-amber-500 border-white text-white scale-110 shadow-amber-500/50"
                            : "bg-zinc-900 border-amber-400/60 text-amber-300 hover:border-amber-300 hover:bg-amber-950"
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                    </button>

                    <div
                      className={`absolute bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[10px] whitespace-nowrap shadow-xl transition-all pointer-events-none ${
                        isSelected
                          ? "bg-white text-zinc-900 font-semibold opacity-100 translate-y-0"
                          : "bg-black/80 text-white opacity-0 group-hover:opacity-100 translate-y-1"
                      }`}
                    >
                      {place.name} • {place.memoryCount} mem{place.memoryCount > 1 ? "s" : ""}
                    </div>
                  </div>
                );
              })}

              {/* Bottom Map Controls Widget */}
              <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-zinc-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Click markers to isolate spatial moments</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
