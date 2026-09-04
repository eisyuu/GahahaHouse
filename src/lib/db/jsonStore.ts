import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

const writeLocks = new Map<string, Promise<unknown>>();

function withLock<T>(filePath: string, fn: () => Promise<T>): Promise<T> {
  const previous = writeLocks.get(filePath) ?? Promise.resolve();
  const next = previous.then(fn, fn);
  writeLocks.set(
    filePath,
    next.catch(() => undefined),
  );
  return next;
}

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function resolveDataFile(fileName: string): string {
  return path.join(DATA_DIR, fileName);
}

async function readJsonFileRaw<T>(fileName: string, defaultValue: T): Promise<T> {
  await ensureDataDir();
  const filePath = resolveDataFile(fileName);
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await writeJsonFileRaw(fileName, defaultValue);
      return defaultValue;
    }
    throw error;
  }
}

async function writeJsonFileRaw<T>(fileName: string, data: T): Promise<void> {
  await ensureDataDir();
  const filePath = resolveDataFile(fileName);
  const tmpPath = path.join(DATA_DIR, `.${fileName}.${process.pid}.tmp`);
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tmpPath, filePath);
}

export function readJsonFile<T>(fileName: string, defaultValue: T): Promise<T> {
  return withLock(fileName, () => readJsonFileRaw(fileName, defaultValue));
}

export function writeJsonFile<T>(fileName: string, data: T): Promise<void> {
  return withLock(fileName, () => writeJsonFileRaw(fileName, data));
}

export function mutateJsonFile<T>(
  fileName: string,
  defaultValue: T,
  mutator: (current: T) => T | Promise<T>,
): Promise<T> {
  return withLock(fileName, async () => {
    const current = await readJsonFileRaw(fileName, defaultValue);
    const next = await mutator(current);
    await writeJsonFileRaw(fileName, next);
    return next;
  });
}
