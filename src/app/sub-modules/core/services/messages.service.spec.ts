import {TestBed} from '@angular/core/testing';

import {MessagesService} from './messages.service';
import {ModalService} from './modal.service';
import {NotificationLogicService} from './notification-logic.service';

describe('NotificationService', () => {
  beforeEach(() => {

    const spyModalService = jasmine.createSpyObj('ModalService', ['openModal']);
    const spyNotifications = jasmine.createSpyObj('NotificationLogicService', ['addMessage']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ModalService,
          useValue: spyModalService
        },
        {
          provide: NotificationLogicService,
          useValue: spyNotifications
        }
      ]
    });
  });

  it('should be created', () => {
    const service: MessagesService = TestBed.get(MessagesService);
    expect(service).toBeTruthy();
  });
});
