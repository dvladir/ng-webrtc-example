import { TestBed } from '@angular/core/testing';

import { OverlayViewRefContainerService } from './overlay-view-ref-container.service';

describe('OverlayViewRefContainerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OverlayViewRefContainerService = TestBed.get(OverlayViewRefContainerService);
    expect(service).toBeTruthy();
  });
});
