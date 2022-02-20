import {Component, HostBinding, OnInit} from '@angular/core';
import {animate, group, state, style, transition, trigger} from '@angular/animations';
import {NotificationLogicService} from '../../services/notification-logic.service';
import {Observable} from 'rxjs';
import {Message} from '../../shared/message';
import {MessageType} from '../../shared/message-type.enum';

@Component({
  selector: 'app-notifications-view',
  templateUrl: './notifications-view.component.html',
  styleUrls: ['./notifications-view.component.css'],
  animations: [
    trigger('container', [
      state('beforeAdd', style({bottom: '-60px'})),
      state('afterAdd', style({bottom: '0px'})),
      transition('afterAdd => beforeAdd', [
        style({bottom: '-60px'}),
        animate('0.3s 0.1s ease', style({bottom: '0px'}))
      ])
    ]),
    trigger('flyIn', [
      state('in', style({transform: 'translate(0, 0)', opacity: 1})),
      transition('void => *', [
        style({transform: 'translate(0, 50px)', opacity: 0}),
        group([
          animate('0.3s 0.1s ease', style({
            transform: 'translate(0, 0)',
          })),
          animate('0.3s ease', style({
            opacity: 1
          }))
        ])
      ]),
    ]),
    trigger('flyOut', [
      state('out', style({transform: 'translate(0, 0)', opacity: 1})),
      transition('* => void', [
        group([
          animate('0.3s ease', style({
            transform: 'translate(50px, 0)',
          })),
          animate('0.3s 0.2s ease', style({
            opacity: 0
          }))
        ])
      ])
    ])
  ]
})
export class NotificationsViewComponent {

  constructor(
    private _messagesLogic: NotificationLogicService
  ) {
  }

  readonly MessageType: typeof MessageType = MessageType;

  @HostBinding('@container')
  appearAnimate: 'beforeAdd' | 'afterAdd' = 'afterAdd';

  get messages$(): Observable<Message[]> {
    return this._messagesLogic.messages$;
  }

  remove(message: Message): void {
    this._messagesLogic.removeMessage(message);
  }

}
