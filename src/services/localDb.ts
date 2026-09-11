import { createSeedData, LocalDbShape } from '../data/appSeedData';

const DB_STORAGE_KEY = 'agroassist_local_db';

function loadDb(): LocalDbShape {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through to reseed
  }
  const seeded = createSeedData();
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

// Singleton, mirroring the previous in-memory MockDatabase: loaded once per
// page session from localStorage (or freshly seeded on first run), and
// persisted back to localStorage after every mutation via persistDb().
export const db: LocalDbShape = loadDb();

export function persistDb(): void {
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
}

export function nextId<T extends { id: number }>(items: T[], floor = 1): number {
  return items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : floor;
}
