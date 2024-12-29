export class MXCache {
  private cache: Map<string, string>;
  private maxSize: number;

  constructor(maxSize = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(domain: string): string | undefined {
    return this.cache.get(domain);
  }

  set(domain: string, provider: string): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry if cache is full
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(domain, provider);
  }
}