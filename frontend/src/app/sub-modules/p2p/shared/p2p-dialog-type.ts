import {P2PMessageType} from './p2p-message-type.enum';

export type P2PDialogType = P2PMessageType.startScreenCast |
  P2PMessageType.startVideo |
  P2PMessageType.startAudio |
  P2PMessageType.startChat;

export const ALL_P2P_DIALOGS: P2PDialogType[] = [
  P2PMessageType.startScreenCast,
  P2PMessageType.startVideo,
  P2PMessageType.startAudio,
  P2PMessageType.startChat
];
