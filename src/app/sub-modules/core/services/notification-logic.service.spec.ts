import { TestBed } from '@angular/core/testing';

import { NotificationLogicService } from './notification-logic.service';

describe('MessagesLogicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationLogicService = TestBed.get(NotificationLogicService);
    expect(service).toBeTruthy();
  });
});
