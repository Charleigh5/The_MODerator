import { useState } from 'react';
import { MODS } from '../data/modLibrary';
import type { ModEntry } from '../types';
import { IconStar, IconDownload, IconEdit, IconChevronRight, IconAlert, IconFile, IconCode, IconTest, IconX } from './icons';

interface ModLibraryBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onUseMod: (mod: ModEntry) => void;
  onModifyMod: (mod: ModEntry) => void;
}

export default function ModLibraryBrowser({ isOpen, onClose, onUseMod, onModifyMod }: ModLibraryBrowserProps) {
  const [selectedMod, setSelectedMod] = useState<ModEntry | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredMods = MODS.filter(mod => {
    const matchesFilter = filter === 'all' || mod.tags.includes(filter);
    const matchesSearch = searchQuery === '' || 
      mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = Array.from(new Set(MODS.flatMap(mod => mod.tags)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative flex h-[90vh] w-[90vw] max-w-7xl flex-col overflow-hidden rounded-xl border-2 border-maize-400 bg-navy-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-maize-400/30 bg-navy-900 px-6 py-4">
          <div>
            <h2 className="font-display text-2xl tracking-wider text-maize-400">
              MOD LIBRARY
            </h2>
            <p className="mt-1 text-sm text-chalk/70">
              Browse {MODS.length} proven mods from trusted platforms
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-chalk/60 transition-colors hover:bg-chalk/10 hover:text-chalk"
          >
            <IconX className="h-6 w-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 border-b border-maize-400/20 bg-navy-900/50 px-6 py-3">
          <input
            type="text"
            placeholder="Search mods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-md border border-maize-400/30 bg-navy-800 px-4 py-2 text-sm text-chalk placeholder:text-chalk/40 focus:border-maize-400/60 focus:outline-none"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-maize-400/30 bg-navy-800 px-4 py-2 text-sm text-chalk focus:border-maize-400/60 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Mod List */}
          <div className="w-96 overflow-y-auto border-r border-maize-400/20 bg-navy-900/30">
            {filteredMods.map(mod => (
              <button
                key={mod.id}
                onClick={() => setSelectedMod(mod)}
                className={`w-full border-b border-maize-400/10 p-4 text-left transition-colors hover:bg-maize-400/5 ${
                  selectedMod?.id === mod.id ? 'bg-maize-400/10' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-chalk">{mod.name}</h3>
                    <p className="mt-1 text-xs text-chalk/60">{mod.platform}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-maize-400">
                        <IconStar className="h-3 w-3 fill-current" />
                        {mod.rating}
                      </span>
                      <span className="text-xs text-chalk/50">
                        {mod.reviewCount} reviews
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-semibold ${
                      mod.reliability >= 95 ? 'text-inkgreen' : 'text-maize-400'
                    }`}>
                      {mod.reliability}%
                    </div>
                    <div className="text-[10px] text-chalk/50">reliable</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Mod Details */}
          <div className="flex-1 overflow-y-auto bg-navy-950">
            {selectedMod ? (
              <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-chalk">{selectedMod.name}</h2>
                  <div className="mt-2 flex items-center gap-4 text-sm text-chalk/70">
                    <span>{selectedMod.platform}</span>
                    <span>·</span>
                    <span>{selectedMod.version}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-maize-400">
                      <IconStar className="h-4 w-4 fill-current" />
                      {selectedMod.rating}/5
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-maize-400">
                    Description
                  </h3>
                  <p className="text-sm leading-relaxed text-chalk/90">
                    {selectedMod.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mb-6 flex gap-3">
                  <button
                    onClick={() => onUseMod(selectedMod)}
                    className="flex items-center gap-2 rounded-lg bg-maize-400 px-6 py-3 font-semibold text-navy-950 transition-colors hover:bg-maize-300"
                  >
                    <IconDownload className="h-5 w-5" />
                    Use This Mod
                  </button>
                  <button
                    onClick={() => onModifyMod(selectedMod)}
                    className="flex items-center gap-2 rounded-lg border-2 border-maize-400 px-6 py-3 font-semibold text-maize-400 transition-colors hover:bg-maize-400/10"
                  >
                    <IconEdit className="h-5 w-5" />
                    Modify This Mod
                  </button>
                </div>

                {/* Pros & Cons */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-inkgreen/30 bg-inkgreen/10 p-4">
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-inkgreen">
                      Pros
                    </h3>
                    <ul className="space-y-1">
                      {selectedMod.pros.map((pro, i) => (
                        <li key={i} className="text-sm text-chalk/80">✓ {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-inkred/30 bg-inkred/10 p-4">
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-inkred">
                      Cons
                    </h3>
                    <ul className="space-y-1">
                      {selectedMod.cons.map((con, i) => (
                        <li key={i} className="text-sm text-chalk/80">✗ {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Warnings */}
                {selectedMod.warnings.length > 0 && (
                  <div className="mb-6 rounded-lg border border-maize-400/30 bg-maize-400/10 p-4">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-maize-400">
                      <IconAlert className="h-4 w-4" />
                      Warnings
                    </h3>
                    <ul className="space-y-1">
                      {selectedMod.warnings.map((warning, i) => (
                        <li key={i} className="text-sm text-chalk/80">⚠ {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Files */}
                <div className="mb-6">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-maize-400">
                    <IconFile className="h-4 w-4" />
                    Files ({selectedMod.files.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedMod.files.map((file, i) => (
                      <div key={i} className="rounded-lg border border-maize-400/20 bg-navy-900/50 p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm text-chalk">{file.name}</span>
                          <span className="text-xs text-chalk/50">{file.size}</span>
                        </div>
                        <p className="mt-1 text-xs text-chalk/70">{file.purpose}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Variables */}
                <div className="mb-6">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-maize-400">
                    <IconCode className="h-4 w-4" />
                    Variables ({selectedMod.variables.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedMod.variables.map((variable, i) => (
                      <div key={i} className="rounded-lg border border-maize-400/20 bg-navy-900/50 p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm text-inkgreen">{variable.name}</span>
                          <span className="rounded bg-maize-400/20 px-2 py-0.5 text-xs text-maize-400">
                            {variable.type}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-chalk/70">{variable.purpose}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logic */}
                <div className="mb-6">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-maize-400">
                    <IconCode className="h-4 w-4" />
                    Logic Flow
                  </h3>
                  <div className="rounded-lg border border-maize-400/20 bg-navy-900/50 p-4">
                    <ol className="space-y-2">
                      {selectedMod.logic.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm text-chalk/80">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-maize-400/20 text-xs text-maize-400">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Test Plan */}
                <div className="mb-6">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-maize-400">
                    <IconTest className="h-4 w-4" />
                    Test Plan
                  </h3>
                  <div className="rounded-lg border border-inkgreen/30 bg-inkgreen/10 p-4">
                    <ul className="space-y-2">
                      {selectedMod.testPlan.map((test, i) => (
                        <li key={i} className="flex gap-2 text-sm text-chalk/80">
                          <span className="text-inkgreen">✓</span>
                          <span>{test}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Reviews */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-maize-400">
                    User Reviews ({selectedMod.reviewCount})
                  </h3>
                  <div className="space-y-3">
                    {selectedMod.reviews.map((review, i) => (
                      <div key={i} className="rounded-lg border border-maize-400/20 bg-navy-900/50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-semibold text-chalk">{review.user}</span>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-sm text-maize-400">
                              <IconStar className="h-3 w-3 fill-current" />
                              {review.rating}
                            </span>
                            <span className="text-xs text-chalk/50">{review.date}</span>
                          </div>
                        </div>
                        <p className="text-sm text-chalk/80">{review.text}</p>
                        <div className="mt-2 text-xs text-chalk/50">
                          {review.helpful} people found this helpful
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-chalk/50">
                Select a mod to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
