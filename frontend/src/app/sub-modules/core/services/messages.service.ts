import {Injectable} from '@angular/core';
import {ModalService} from './modal.service';
import {ConfirmModalComponent} from '../components/confirm-modal/confirm-modal.component';
import {NotificationLogicService} from './notification-logic.service';
import {MessageType} from '../shared/message-type.enum';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private _modal: ModalService,
    private _notifications: NotificationLogicService
  ){

  }

  info(text: string): void {
    const msgType: MessageType = MessageType.INFO;
    this._notifications.addMessage({msgType, text});
  }

  warn(text: string): void {
    const msgType: MessageType = MessageType.WARN;
    this._notifications.addMessage({msgType, text});
  }

  error(text: string): void {
    const msgType: MessageType = MessageType.ERR;
    this._notifications.addMessage({msgType, text});
  }

  success(text: string): void {
    const msgType: MessageType = MessageType.OK;
    this._notifications.addMessage({msgType, text});
  }

  confirm(question: string): Promise<boolean> {
    return this._modal.openModal(ConfirmModalComponent, question) as Promise<boolean>;
  }
}
