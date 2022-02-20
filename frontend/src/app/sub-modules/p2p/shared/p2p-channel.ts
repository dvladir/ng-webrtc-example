import {Observable} from 'rxjs';
import {P2PMessageContent} from './p2p-message';

export interface P2PChannel {
  readonly channelId: string; // equal to receiver client's id
  readonly isExternal: boolean; // True in case of channel is established by the receiver.
  readonly receive$: Observable<P2PMessageContent>;
  readonly onStop$: Observable<any>;
  send(msg: P2PMessageContent): void;
  stop(stopReason?: any): void;
}
