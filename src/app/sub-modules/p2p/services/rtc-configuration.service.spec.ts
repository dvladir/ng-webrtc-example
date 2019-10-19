import { TestBed } from '@angular/core/testing';

import { RtcConfigurationService } from './rtc-configuration.service';

describe('RtcConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RtcConfigurationService = TestBed.get(RtcConfigurationService);
    expect(service).toBeTruthy();
  });
});
