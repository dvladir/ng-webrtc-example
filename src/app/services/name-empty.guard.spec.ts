import { TestBed, async, inject } from '@angular/core/testing';

import { NameEmptyGuard } from './name-empty.guard';

describe('NameEmptyGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NameEmptyGuard]
    });
  });

  it('should ...', inject([NameEmptyGuard], (guard: NameEmptyGuard) => {
    expect(guard).toBeTruthy();
  }));
});
