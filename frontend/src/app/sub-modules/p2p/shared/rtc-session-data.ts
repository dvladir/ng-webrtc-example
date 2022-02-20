import {P2PChannel} from './p2p-channel';

export interface RtcSessionData {
  p2p: P2PChannel;
  waitTimeout: number;
}
