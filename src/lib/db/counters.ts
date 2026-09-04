import { mutateJsonFile } from "./jsonStore";
import type { Counters } from "@/lib/types";

const FILE = "counters.json";
const DEFAULT: Counters = {};

export async function incrementCounter(key: string): Promise<number> {
  let next = 0;
  await mutateJsonFile(FILE, DEFAULT, (counters) => {
    next = (counters[key] ?? 0) + 1;
    return { ...counters, [key]: next };
  });
  return next;
}
