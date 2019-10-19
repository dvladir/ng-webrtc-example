import { TestBed } from '@angular/core/testing';

import { P2PService } from './p2p.service';

describe('P2pService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: P2PService = TestBed.get(P2PService);
    expect(service).toBeTruthy();
  });
});
