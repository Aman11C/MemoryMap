"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app/app-sidebar";
import { AppTopbar } from "@/components/app/app-topbar";
import { SearchModal } from "@/components/app/search-modal";
import { MemoryCreateModal } from "@/components/app/memory-create-modal";
import { MemoryEditModal } from "@/components/app/memory-edit-modal";
import { MemoryDetailModal } from "@/components/app/memory-detail-modal";
import { MemoryProvider, useMemoryContext } from "@/context/memory-context";
import { X } from "lucide-react";

function AppShellContent({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const {
    selectedMemory,
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
    openMemoryDetail,
    refreshMemories,
    displayMemories,
  } = useMemoryContext();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#fafafa] dark:bg-[#08090c]">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full shrink-0">
        <AppSidebar onOpenQuickAdd={openCreate} />
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-10 w-72 h-full flex flex-col bg-white dark:bg-[#0c0e14] shadow-2xl">
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <AppSidebar
              onOpenQuickAdd={() => {
                setMobileNavOpen(false);
                openCreate();
              }}
              onCloseMobile={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AppTopbar
          onOpenSearch={openSearch}
          onOpenQuickAdd={openCreate}
          onToggleMobileNav={() => setMobileNavOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={closeSearch}
        onSelectMemory={(id) => openMemoryDetail(id)}
      />

      <MemoryCreateModal
        isOpen={isCreateOpen}
        onClose={closeCreate}
        onMemoryCreated={() => {
          refreshMemories();
        }}
      />

      <MemoryEditModal
        memory={editingMemory}
        isOpen={Boolean(editingMemory)}
        onClose={closeEdit}
        onMemoryUpdated={() => {
          refreshMemories();
        }}
      />

      <MemoryDetailModal
        memory={selectedMemory}
        onClose={closeMemoryDetail}
        onEdit={(mem) => {
          closeMemoryDetail();
          openEdit(mem);
        }}
        onMemoryDeleted={() => {
          refreshMemories();
          closeMemoryDetail();
        }}
        allMemories={displayMemories}
      />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <MemoryProvider>
      <AppShellContent>{children}</AppShellContent>
    </MemoryProvider>
  );
}
