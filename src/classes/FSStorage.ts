import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const CACHE_FOLDER = 'cache';
const CACHE_FILE = 'fs-storage.json';

interface FSStorage {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
}

class FSStorageImpl implements FSStorage {
  private state: Record<string, unknown> = {};

  constructor() {
    try {
      this.state = JSON.parse(
        readFileSync(join(CACHE_FOLDER, CACHE_FILE), 'utf-8'),
      );
    } catch (_) {
      if (!existsSync(CACHE_FOLDER)) mkdirSync(CACHE_FOLDER);
      writeFileSync(join(CACHE_FOLDER, CACHE_FILE), JSON.stringify(this.state));
    }
  }

  private saveState() {
    writeFileSync(join(CACHE_FOLDER, CACHE_FILE), JSON.stringify(this.state));
  }

  get<T>(key: string): T | null {
    return (this.state[key] as T) ?? null;
  }

  set<T>(key: string, value: T): void {
    this.state[key] = value;
    this.saveState();
  }
}

export const fsStorage = new FSStorageImpl();
