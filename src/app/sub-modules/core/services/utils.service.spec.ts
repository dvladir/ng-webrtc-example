import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';
import {MessagesService} from './messages.service';

describe('UtilsService', () => {
  beforeEach(() => {

    const spyMessages = jasmine.createSpyObj('MessagesService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: MessagesService,
          useValue: spyMessages
        }
      ]
    });
  });

  it('should be created', () => {
    const service: UtilsService = TestBed.get(UtilsService);
    expect(service).toBeTruthy();
  });
});
