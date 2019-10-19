import { TestBed } from '@angular/core/testing';

import { RtcSessionConfigService } from './rtc-session-config.service';

describe('RtcSessionConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RtcSessionConfigService = TestBed.get(RtcSessionConfigService);
    expect(service).toBeTruthy();
  });
});
