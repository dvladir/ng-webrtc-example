import { TestBed } from '@angular/core/testing';

import { P2PUtilsService } from './p2p-utils.service';

describe('P2PUtilsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: P2PUtilsService = TestBed.get(P2PUtilsService);
    expect(service).toBeTruthy();
  });
});
