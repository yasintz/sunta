import Strategy from './baseStrategy';

const memoryStrategy = new (class MemoryStorage implements Storage {
  items: Record<string, string> = {};

  get length() {
    return Object.keys(this.items).length;
  }

  clear(): void {
    this.items = {};
  }
  getItem(key: string): string | null {
    return this.items[key];
  }
  key(index: number): string | null {
    return Object.keys(this.items)[index];
  }
  removeItem(key: string): void {
    delete this.items[key];
  }
  setItem(key: string, value: string): void {
    this.items[key] = value;
  }
})();

class MemoryStrategy<T> extends Strategy<T> {
  constructor(key: string, initialValue: T) {
    super(key, initialValue, memoryStrategy);
  }
}

export default MemoryStrategy;
