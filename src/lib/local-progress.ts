import type { KanjiStatus } from "@/lib/kanji-status";

// Progress for visitors who aren't signed in, kept in this browser's local
// storage (never sent to the server). Shaped like the account progress:
// { character: status }, with grey kanji left out.
export type Progress = Record<string, KanjiStatus>;

const storageKey = "kanji-checklist-progress-v1";
const emptyProgress: Progress = {};

let cached: Progress | null = null;
const listeners = new Set<() => void>();

function read(): Progress {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? (JSON.parse(stored) as Progress) : emptyProgress;
  } catch {
    return emptyProgress; // storage blocked (some private windows) or corrupted
  }
}

// For React's useSyncExternalStore: the same object is returned until the data changes.
export function getLocalProgress(): Progress {
  cached ??= read();
  return cached;
}

export function getServerLocalProgress(): Progress {
  return emptyProgress;
}

export function subscribeLocalProgress(listener: () => void) {
  listeners.add(listener);
  // Another tab changed the progress.
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey) {
      cached = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function write(progress: Progress): boolean {
  try {
    if (Object.keys(progress).length === 0) window.localStorage.removeItem(storageKey);
    else window.localStorage.setItem(storageKey, JSON.stringify(progress));
  } catch {
    return false;
  }
  cached = progress;
  listeners.forEach((listener) => listener());
  return true;
}

// Returns false if the browser wouldn't let us save.
export function setLocalStatus(character: string, status: KanjiStatus): boolean {
  const updated = { ...getLocalProgress() };
  if (status === "unlearnt") delete updated[character];
  else updated[character] = status;
  return write(updated);
}

export function clearLocalProgress() {
  write({});
}
