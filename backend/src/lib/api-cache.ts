interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class TtlCache<T> {
  private store = new Map<string, CacheEntry<T>>();

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.data;
  }

  set(key: string, data: T, ttlMs: number): void {
    this.store.set(key, { data, expiresAt: Date.now() + ttlMs });
    if (this.store.size > 500) this.evictExpired();
  }

  private evictExpired(): void {
    const now = Date.now();
    for (const [k, v] of this.store) {
      if (now > v.expiresAt) this.store.delete(k);
    }
  }
}

export const airQualityCache  = new TtlCache<unknown>();
export const thermalCache     = new TtlCache<unknown>();
export const uvCache          = new TtlCache<unknown>();
export const indiaOgdCache    = new TtlCache<unknown>();
