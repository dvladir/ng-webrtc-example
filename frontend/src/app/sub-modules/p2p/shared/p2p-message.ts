import {P2PMessageType} from './p2p-message-type.enum';

export interface P2PMessageContent {
  messageType: P2PMessageType;
  data: any;
}

export interface P2PMessage {
  uidFrom: string;
  uidTo: string;
  message: P2PMessageContent;
}
