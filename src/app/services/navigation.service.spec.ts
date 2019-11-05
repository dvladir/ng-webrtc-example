import {TestBed} from '@angular/core/testing';

import {NavigationService} from './navigation.service';
import {Router} from '@angular/router';

describe('NavigationService', () => {
  beforeEach(() => {

    const spyRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: spyRouter
        }
      ]
    });
  });

  it('should be created', () => {
    const service: NavigationService = TestBed.get(NavigationService);
    expect(service).toBeTruthy();
  });
});
