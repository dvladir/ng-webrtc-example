import {TestBed, async, inject} from '@angular/core/testing';

import {NameEmptyGuard} from './name-empty.guard';
import {ClientStateService} from '../sub-modules/client';
import {NavigationService} from './navigation.service';

describe('NameEmptyGuard', () => {
  beforeEach(() => {

    const spyClientState = jasmine.createSpyObj('ClientStateService', ['getValue']);
    const spyNav = jasmine.createSpyObj('NavigationService', ['users']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ClientStateService,
          useValue: {
            currentClient: {
              name: 'foo'
            }
          }
        },
        {provide: NavigationService, useValue: spyNav},
        NameEmptyGuard
      ]
    });
  });

  it('should ...', inject([NameEmptyGuard], (guard: NameEmptyGuard) => {
    expect(guard).toBeTruthy();
  }));
});
