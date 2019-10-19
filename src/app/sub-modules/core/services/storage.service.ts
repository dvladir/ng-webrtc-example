export class StorageService {
  constructor(
    protected _storage: Storage
  ) {
  }

  getItem<T>(key: string): T {
    const storedData: string = this._storage.getItem(key);
    if (!storedData) {
      return null;
    }

    let result: T = null;

    try {
      result = JSON.parse(storedData) as T;
    } catch (e) {
    }

    return result;
  }

  setItem<T>(key: string, item: T): void {
    const storedData: string = JSON.stringify(item);
    this._storage.setItem(key, storedData);
  }

  clear(): void {
    this._storage.clear();
  }
}
