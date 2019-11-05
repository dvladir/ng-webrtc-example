import { TestBed } from '@angular/core/testing';

import { P2PUtilsService } from './p2p-utils.service';
import {ClientStateService} from '../../client';

describe('P2PUtilsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: ClientStateService,
        useValue: {
          currentClient: {
            uid: '1'
          }
        }
      }
    ]
  }));

  it('should be created', () => {
    const service: P2PUtilsService = TestBed.get(P2PUtilsService);
    expect(service).toBeTruthy();
  });
});
