import { useState, useEffect } from "react";
import type { ModEntry, ModLibrary } from "../lib/modStore";
import {
  loadModLibrary,
  saveModLibrary,
  renameModInLibrary,
  deleteModFromLibrary,
  updateModInLibrary,
  formatModHistory,
} from "../lib/modStore";
import { IconEdit, IconTrash, IconClock, IconSearch, IconFolder, IconChevronRight } from "./icons";

interface ModLibraryPanelProps {
  onResumeMod: (mod: ModEntry) => void;
  onEditMod: (mod: ModEntry) => void;
}

export default function ModLibraryPanel({ onResumeMod, onEditMod }: ModLibraryPanelProps) {
  const [library, setLibrary] = useState<ModLibrary>(() => loadModLibrary());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMod, setSelectedMod] = useState<ModEntry | null>(null);
  const [editingMod, setEditingMod] = useState<ModEntry | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Filter mods based on search
  const filteredMods = searchQuery
    ? library.mods.filter(
        (mod) =>
          mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mod.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : library.mods;

  // Sort by most recently modified
  const sortedMods = [...filteredMods].sort((a, b) => b.modifiedAt - a.modifiedAt);

  const handleRename = (mod: ModEntry) => {
    setEditingMod(mod);
    setEditName(mod.name);
    setEditDescription(mod.description);
  };

  const handleSaveEdit = () => {
    if (!editingMod) return;

    const changes: string[] = [];
    if (editingMod.name !== editName) {
      changes.push(`Renamed from "${editingMod.name}" to "${editName}"`);
    }
    if (editingMod.description !== editDescription) {
      changes.push("Updated description");
    }

    const updated = updateModInLibrary(
      library,
      editingMod.id,
      { name: editName, description: editDescription },
      undefined,
      changes.length > 0 ? changes : ["Metadata updated"]
    );

    if (updated) {
      setLibrary({ ...library });
      setEditingMod(null);
      if (selectedMod?.id === updated.id) {
        setSelectedMod(updated);
      }
    }
  };

  const handleDelete = (modId: string) => {
    if (confirmDelete === modId) {
      deleteModFromLibrary(library, modId);
      setLibrary({ ...library });
      if (selectedMod?.id === modId) {
        setSelectedMod(null);
      }
      setConfirmDelete(null);
    } else {
      setConfirmDelete(modId);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(timestamp);
  };

  return (
    <div className="flex h-full flex-col bg-navy-950">
      {/* Header */}
      <div className="border-b-2 border-maize-400/30 bg-navy-900 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconFolder className="h-5 w-5 text-maize-400" />
            <h2 className="font-display text-lg tracking-wider text-maize-400">
              MOD LIBRARY
            </h2>
          </div>
          <span className="font-mono text-xs text-chalk/60">
            {library.mods.length} {library.mods.length === 1 ? "mod" : "mods"}
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-chalk/40" />
          <input
            type="text"
            placeholder="Search mods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border-2 border-maize-400/30 bg-navy-800 py-2 pl-10 pr-4 text-sm text-chalk placeholder:text-chalk/40 focus:border-maize-400/60 focus:outline-none"
          />
        </div>
      </div>

      {/* Mod List */}
      <div className="flex-1 overflow-y-auto">
        {sortedMods.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <IconFolder className="mb-3 h-12 w-12 text-chalk/20" />
            <p className="text-sm text-chalk/60">
              {searchQuery ? "No mods found" : "No mods in library yet"}
            </p>
            <p className="mt-1 text-xs text-chalk/40">
              {searchQuery ? "Try a different search" : "Create a mod to get started"}
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {sortedMods.map((mod) => (
              <div
                key={mod.id}
                className={`group cursor-pointer rounded-lg border-2 p-3 transition-all ${
                  selectedMod?.id === mod.id
                    ? "border-maize-400 bg-navy-800"
                    : "border-transparent bg-navy-900 hover:border-maize-400/30 hover:bg-navy-800/50"
                }`}
                onClick={() => setSelectedMod(mod)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-chalk">{mod.name}</h3>
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                          mod.status === "active"
                            ? "bg-inkgreen/20 text-inkgreen"
                            : mod.status === "draft"
                            ? "bg-inkgold/20 text-inkgold"
                            : "bg-chalk/10 text-chalk/60"
                        }`}
                      >
                        {mod.status}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-chalk/70">
                      {mod.description || "No description"}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-chalk/50">
                      <span className="flex items-center gap-1">
                        <IconClock className="h-3 w-3" />
                        {formatRelativeTime(mod.modifiedAt)}
                      </span>
                      <span>v{mod.currentVersion}</span>
                      <span className="capitalize">{mod.category}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRename(mod);
                      }}
                      className="rounded p-1.5 text-chalk/60 hover:bg-maize-400/20 hover:text-maize-400"
                      title="Edit mod"
                    >
                      <IconEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(mod.id);
                      }}
                      className={`rounded p-1.5 ${
                        confirmDelete === mod.id
                          ? "bg-inkred text-chalk"
                          : "text-chalk/60 hover:bg-inkred/20 hover:text-inkred"
                      }`}
                      title={confirmDelete === mod.id ? "Click again to confirm" : "Delete mod"}
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mod Detail Panel */}
      {selectedMod && (
        <div className="border-t-2 border-maize-400/30 bg-navy-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm tracking-wider text-maize-400">
              MOD DETAILS
            </h3>
            <button
              onClick={() => setSelectedMod(null)}
              className="text-xs text-chalk/60 hover:text-chalk"
            >
              Close
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <div className="mb-1 text-xs text-chalk/60">Name</div>
              <div className="text-sm text-chalk">{selectedMod.name}</div>
            </div>

            <div>
              <div className="mb-1 text-xs text-chalk/60">Description</div>
              <div className="text-sm text-chalk/80">
                {selectedMod.description || "No description"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="mb-1 text-xs text-chalk/60">Category</div>
                <div className="text-sm capitalize text-chalk">{selectedMod.category}</div>
              </div>
              <div>
                <div className="mb-1 text-xs text-chalk/60">Status</div>
                <div className="text-sm capitalize text-chalk">{selectedMod.status}</div>
              </div>
              <div>
                <div className="mb-1 text-xs text-chalk/60">Created</div>
                <div className="text-xs text-chalk">{formatDate(selectedMod.createdAt)}</div>
              </div>
              <div>
                <div className="mb-1 text-xs text-chalk/60">Modified</div>
                <div className="text-xs text-chalk">{formatDate(selectedMod.modifiedAt)}</div>
              </div>
            </div>

            {selectedMod.tags.length > 0 && (
              <div>
                <div className="mb-1 text-xs text-chalk/60">Tags</div>
                <div className="flex flex-wrap gap-1">
                  {selectedMod.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-maize-400/20 px-2 py-0.5 text-xs text-maize-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* History Toggle */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex w-full items-center justify-between rounded border border-maize-400/30 bg-navy-800 px-3 py-2 text-xs text-chalk hover:border-maize-400/60"
            >
              <span>Version History ({selectedMod.versions.length})</span>
              <IconChevronRight
                className={`h-4 w-4 transition-transform ${showHistory ? "rotate-90" : ""}`}
              />
            </button>

            {/* History */}
            {showHistory && (
              <div className="max-h-40 space-y-1 overflow-y-auto rounded border border-maize-400/20 bg-navy-800/50 p-2">
                {formatModHistory(selectedMod)
                  .reverse()
                  .map((entry, i) => (
                    <div key={i} className="text-xs text-chalk/70">
                      {entry}
                    </div>
                  ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => onResumeMod(selectedMod)}
                className="flex-1 rounded border-2 border-maize-400 bg-maize-400/10 px-3 py-2 text-xs font-semibold text-maize-400 hover:bg-maize-400/20"
              >
                Resume Editing
              </button>
              <button
                onClick={() => onEditMod(selectedMod)}
                className="flex-1 rounded border-2 border-chalk/30 bg-chalk/5 px-3 py-2 text-xs font-semibold text-chalk hover:bg-chalk/10"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingMod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-lg border-2 border-maize-400 bg-navy-900 p-6">
            <h3 className="mb-4 font-display text-lg tracking-wider text-maize-400">
              EDIT MOD
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-chalk/60">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded border-2 border-maize-400/30 bg-navy-800 px-3 py-2 text-sm text-chalk focus:border-maize-400/60 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-chalk/60">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded border-2 border-maize-400/30 bg-navy-800 px-3 py-2 text-sm text-chalk focus:border-maize-400/60 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 rounded border-2 border-maize-400 bg-maize-400 px-3 py-2 text-sm font-semibold text-navy-950 hover:bg-maize-300"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingMod(null)}
                  className="flex-1 rounded border-2 border-chalk/30 bg-chalk/5 px-3 py-2 text-sm font-semibold text-chalk hover:bg-chalk/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
