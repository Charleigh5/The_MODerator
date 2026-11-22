export interface ModVersion {
  version: number;
  timestamp: number;
  changes: string[];
  bundle?: any; // BundleMeta
}

export interface ModEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: number;
  modifiedAt: number;
  sessionId: string;
  versions: ModVersion[];
  currentVersion: number;
  tags: string[];
  status: "draft" | "active" | "archived";
}

export interface ModLibrary {
  mods: ModEntry[];
  lastUpdated: number;
}

const MOD_LIBRARY_KEY = "gridiron.modLibrary.v1";

export function loadModLibrary(): ModLibrary {
  try {
    const raw = localStorage.getItem(MOD_LIBRARY_KEY);
    if (!raw) return { mods: [], lastUpdated: Date.now() };
    return JSON.parse(raw);
  } catch {
    return { mods: [], lastUpdated: Date.now() };
  }
}

export function saveModLibrary(library: ModLibrary): void {
  try {
    library.lastUpdated = Date.now();
    localStorage.setItem(MOD_LIBRARY_KEY, JSON.stringify(library));
  } catch (e) {
    console.error("Failed to save mod library:", e);
  }
}

export function addModToLibrary(
  library: ModLibrary,
  mod: Omit<ModEntry, "id" | "createdAt" | "modifiedAt" | "versions" | "currentVersion">,
  bundle?: any
): ModEntry {
  const now = Date.now();
  const newMod: ModEntry = {
    ...mod,
    id: `mod_${now}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: now,
    modifiedAt: now,
    versions: [
      {
        version: 1,
        timestamp: now,
        changes: ["Initial creation"],
        bundle,
      },
    ],
    currentVersion: 1,
  };

  library.mods.push(newMod);
  saveModLibrary(library);
  return newMod;
}

export function updateModInLibrary(
  library: ModLibrary,
  modId: string,
  updates: Partial<Pick<ModEntry, "name" | "description" | "tags" | "status">>,
  bundle?: any,
  changeNotes?: string[]
): ModEntry | null {
  const mod = library.mods.find((m) => m.id === modId);
  if (!mod) return null;

  const now = Date.now();
  const newVersion = mod.currentVersion + 1;

  // Update mod metadata
  if (updates.name !== undefined) mod.name = updates.name;
  if (updates.description !== undefined) mod.description = updates.description;
  if (updates.tags !== undefined) mod.tags = updates.tags;
  if (updates.status !== undefined) mod.status = updates.status;

  mod.modifiedAt = now;
  mod.currentVersion = newVersion;

  // Add new version
  mod.versions.push({
    version: newVersion,
    timestamp: now,
    changes: changeNotes || ["Updated mod"],
    bundle,
  });

  saveModLibrary(library);
  return mod;
}

export function renameModInLibrary(
  library: ModLibrary,
  modId: string,
  newName: string
): ModEntry | null {
  return updateModInLibrary(library, modId, { name: newName }, undefined, [
    `Renamed to "${newName}"`,
  ]);
}

export function deleteModFromLibrary(library: ModLibrary, modId: string): boolean {
  const index = library.mods.findIndex((m) => m.id === modId);
  if (index === -1) return false;

  library.mods.splice(index, 1);
  saveModLibrary(library);
  return true;
}

export function getModFromLibrary(
  library: ModLibrary,
  modId: string
): ModEntry | null {
  return library.mods.find((m) => m.id === modId) || null;
}

export function getModVersion(
  mod: ModEntry,
  version: number
): ModVersion | null {
  return mod.versions.find((v) => v.version === version) || null;
}

export function searchMods(
  library: ModLibrary,
  query: string
): ModEntry[] {
  const lowerQuery = query.toLowerCase();
  return library.mods.filter(
    (mod) =>
      mod.name.toLowerCase().includes(lowerQuery) ||
      mod.description.toLowerCase().includes(lowerQuery) ||
      mod.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      mod.category.toLowerCase().includes(lowerQuery)
  );
}

export function getModsByCategory(
  library: ModLibrary,
  category: string
): ModEntry[] {
  return library.mods.filter((mod) => mod.category === category);
}

export function getRecentMods(
  library: ModLibrary,
  limit: number = 10
): ModEntry[] {
  return [...library.mods]
    .sort((a, b) => b.modifiedAt - a.modifiedAt)
    .slice(0, limit);
}

export function formatModHistory(mod: ModEntry): string[] {
  return mod.versions.map((v) => {
    const date = new Date(v.timestamp).toLocaleString();
    const changes = v.changes.join(", ");
    return `v${v.version} (${date}): ${changes}`;
  });
}
