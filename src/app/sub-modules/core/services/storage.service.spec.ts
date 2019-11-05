import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

class FakeStorage implements Storage {
  readonly length: number;

  clear(): void {
  }

  getItem(key: string): string | null {
    return undefined;
  }

  key(index: number): string | null {
    return undefined;
  }

  removeItem(key: string): void {
  }

  setItem(key: string, value: string): void {
  }

}

describe('StorageService', () => {

  it('should be created', () => {
    const service: StorageService = new StorageService(new FakeStorage());
    expect(service).toBeTruthy();
  });
});
