import {Injectable} from '@angular/core';
import {Base64} from "js-base64";
import {ClientStateService} from '../../client';
import {P2PMessage, P2PMessageContent} from '../shared/p2p-message';

@Injectable({
  providedIn: 'root'
})
export class P2PUtilsService {

  constructor(
    private _clientState: ClientStateService
  ) {
  }

  obj2Base64(obj: any): string {
    const json: string = JSON.stringify(obj);
    const res: string = Base64.btoa(json);
    return res;
  }

  base642Obj(base64: string): any {
    const json: string = Base64.atob(base64);
    let result: any;
    try {
      result = JSON.parse(json);
    } catch (e) {
    }

    return result;
  }

  createMessage(receiverUid: string, messageContent: P2PMessageContent): P2PMessage {
    const messageType = messageContent.messageType;
    let data = messageContent.data;

    if (data) {
      data = this.obj2Base64(data);
    }

    const message: P2PMessageContent = {messageType, data};
    const uidTo = receiverUid;
    const uidFrom = this._clientState.currentClient.uid;
    return {uidFrom, uidTo, message};
  }

  extractMessageContent(msg: P2PMessage): P2PMessageContent {
    const {message} = msg;
    const messageType = message.messageType;
    let data = message.data;

    if (data) {
      data = this.base642Obj(data);
    }
    return {messageType, data};
  }

}
