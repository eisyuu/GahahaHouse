import { getTursoClient } from "./tursoClient";

let tableReady: Promise<void> | undefined;

function ensureTable(): Promise<void> {
  if (!tableReady) {
    tableReady = getTursoClient()
      .execute("CREATE TABLE IF NOT EXISTS json_store (key TEXT PRIMARY KEY, value TEXT NOT NULL)")
      .then(() => undefined);
  }
  return tableReady;
}

const writeLocks = new Map<string, Promise<unknown>>();

function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const previous = writeLocks.get(key) ?? Promise.resolve();
  const next = previous.then(fn, fn);
  writeLocks.set(
    key,
    next.catch(() => undefined),
  );
  return next;
}

async function readJsonFileRaw<T>(key: string, defaultValue: T): Promise<T> {
  await ensureTable();
  const result = await getTursoClient().execute({
    sql: "SELECT value FROM json_store WHERE key = ?",
    args: [key],
  });
  const row = result.rows[0];
  if (!row) {
    await writeJsonFileRaw(key, defaultValue);
    return defaultValue;
  }
  return JSON.parse(row.value as string) as T;
}

async function writeJsonFileRaw<T>(key: string, data: T): Promise<void> {
  await ensureTable();
  await getTursoClient().execute({
    sql: "INSERT INTO json_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    args: [key, JSON.stringify(data)],
  });
}

export function readJsonFile<T>(key: string, defaultValue: T): Promise<T> {
  return withLock(key, () => readJsonFileRaw(key, defaultValue));
}

export function writeJsonFile<T>(key: string, data: T): Promise<void> {
  return withLock(key, () => writeJsonFileRaw(key, data));
}

export function mutateJsonFile<T>(
  key: string,
  defaultValue: T,
  mutator: (current: T) => T | Promise<T>,
): Promise<T> {
  return withLock(key, async () => {
    const current = await readJsonFileRaw(key, defaultValue);
    const next = await mutator(current);
    await writeJsonFileRaw(key, next);
    return next;
  });
}
