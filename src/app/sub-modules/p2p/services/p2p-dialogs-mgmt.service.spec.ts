import { TestBed } from '@angular/core/testing';

import { P2PDialogsMgmtService } from './p2p-dialogs-mgmt.service';

describe('P2PDialogsMgmtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: P2PDialogsMgmtService = TestBed.get(P2PDialogsMgmtService);
    expect(service).toBeTruthy();
  });
});
