import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NotificationsViewComponent} from './notifications-view.component';
import {NotificationLogicService} from '../../services/notification-logic.service';
import {Observable, of} from 'rxjs';
import {Message} from '../../shared/message';

export class MockNotificationLogicService {
  readonly messages$: Observable<Message[]> = of([]);

  removeMessage(message: Message): void {
  }
}

describe('NotificationsViewComponent', () => {
  let component: NotificationsViewComponent;
  let fixture: ComponentFixture<NotificationsViewComponent>;

  beforeEach(async(() => {


    TestBed.configureTestingModule({
      providers: [
        {
          provide: NotificationLogicService,
          useValue: MockNotificationLogicService
        }
      ],
      declarations: [NotificationsViewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
