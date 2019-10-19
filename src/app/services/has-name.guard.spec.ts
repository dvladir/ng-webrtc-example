import { TestBed, async, inject } from '@angular/core/testing';

import { HasNameGuard } from './has-name.guard';

describe('HasNameGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HasNameGuard]
    });
  });

  it('should ...', inject([HasNameGuard], (guard: HasNameGuard) => {
    expect(guard).toBeTruthy();
  }));
});
