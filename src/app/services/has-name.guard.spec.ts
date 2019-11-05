import { TestBed, async, inject } from '@angular/core/testing';

import { HasNameGuard } from './has-name.guard';
import {NavigationService} from './navigation.service';
import {ClientStateService} from '../sub-modules/client';

describe('HasNameGuard', () => {
  beforeEach(() => {

    const spayNav = jasmine.createSpyObj('NavigationService', ['login']);

    TestBed.configureTestingModule({
      providers: [
        HasNameGuard,
        {
          provide: NavigationService,
          useValue: spayNav
        },
        {
          provide: ClientStateService,
          useValue: {
            currentClient: {
              name: 'foo'
            }
          }
        }
      ]
    });
  });

  it('should ...', inject([HasNameGuard], (guard: HasNameGuard) => {
    expect(guard).toBeTruthy();
  }));
});
