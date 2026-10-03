"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Memory } from "@/lib/types";
import { MOCK_MEMORIES } from "@/lib/mock-data";
import { DatabaseMemory, fetchUserMemories } from "@/lib/services/memory-service";
import { useAuth } from "./auth-context";

interface MemoryContextType {
  dbMemories: DatabaseMemory[];
  mockMemories: Memory[];
  displayMemories: (DatabaseMemory | Memory)[];
  isLoading: boolean;
  refreshMemories: () => Promise<void>;
  selectedMemory: DatabaseMemory | Memory | null;
  openMemoryDetail: (id: string) => void;
  closeMemoryDetail: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  isCreateOpen: boolean;
  openCreate: () => void;
  closeCreate: () => void;
  editingMemory: DatabaseMemory | null;
  openEdit: (mem: DatabaseMemory) => void;
  closeEdit: () => void;
  showDemoData: boolean;
  toggleShowDemoData: () => void;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export function MemoryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [dbMemories, setDbMemories] = useState<DatabaseMemory[]>([]);
  const [mockMemories] = useState<Memory[]>(MOCK_MEMORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMemory, setSelectedMemory] = useState<DatabaseMemory | Memory | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<DatabaseMemory | null>(null);
  const [showDemoData, setShowDemoData] = useState(false);

  // Fetch real memories from Supabase
  const refreshMemories = useCallback(async () => {
    if (!user) {
      setDbMemories([]);
      setIsLoading(false);
      return;
    }
    try {
      const records = await fetchUserMemories(user.id);
      setDbMemories(records);
    } catch (err) {
      console.error("Error refreshing memories:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      if (!user) {
        setDbMemories([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const records = await fetchUserMemories(user.id);
        if (!ignore) {
          setDbMemories(records);
        }
      } catch (err) {
        console.error("Error loading user memories:", err);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      ignore = true;
    };
  }, [user]);

  // If user has created real memories, prioritize them. If user has none and enabled demo data, show mock
  const displayMemories: (DatabaseMemory | Memory)[] =
    dbMemories.length > 0
      ? dbMemories
      : showDemoData
      ? mockMemories
      : [];

  const openMemoryDetail = (id: string) => {
    // Check db first
    const foundDb = dbMemories.find((m) => m.id === id);
    if (foundDb) {
      setSelectedMemory(foundDb);
      return;
    }
    // Check mock
    const foundMock = mockMemories.find((m) => m.id === id);
    if (foundMock) {
      setSelectedMemory(foundMock);
    }
  };

  const closeMemoryDetail = () => {
    setSelectedMemory(null);
  };

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const openEdit = (mem: DatabaseMemory) => setEditingMemory(mem);
  const closeEdit = () => setEditingMemory(null);

  const toggleShowDemoData = () => setShowDemoData((prev) => !prev);

  return (
    <MemoryContext.Provider
      value={{
        dbMemories,
        mockMemories,
        displayMemories,
        isLoading,
        refreshMemories,
        selectedMemory,
        openMemoryDetail,
        closeMemoryDetail,
        isSearchOpen,
        openSearch,
        closeSearch,
        isCreateOpen,
        openCreate,
        closeCreate,
        editingMemory,
        openEdit,
        closeEdit,
        showDemoData,
        toggleShowDemoData,
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
}

export function useMemoryContext() {
  const ctx = useContext(MemoryContext);
  if (!ctx) {
    throw new Error("useMemoryContext must be used within a MemoryProvider");
  }
  return ctx;
}
