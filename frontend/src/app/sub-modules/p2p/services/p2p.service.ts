import {Injectable} from '@angular/core';
import {EventTypes, WebsocketService} from '../../websockets';
import {ClientStateService} from '../../client';
import {P2PChannel} from '../shared/p2p-channel';
import {merge, Observable, Subject} from 'rxjs';
import {P2PMessage, P2PMessageContent} from '../shared/p2p-message';
import {filter, first, map, pairwise, takeUntil, tap} from 'rxjs/operators';
import {P2PMessageType} from '../shared/p2p-message-type.enum';
import {P2PUtilsService} from './p2p-utils.service';
import {ALL_P2P_DIALOGS, P2PDialogType} from '../shared/p2p-dialog-type';
import {P2PDialogsMgmtService} from './p2p-dialogs-mgmt.service';

/**
 * Contains logic that relates to communication between to peers through the websockets
 */
@Injectable({
  providedIn: 'root'
})
export class P2PService {

  constructor(
    private _wss: WebsocketService,
    private _clients: ClientStateService,
    private _p2pUtils: P2PUtilsService,
    private _p2pDialogs: P2PDialogsMgmtService
  ) {

    const initMsgTypes: P2PMessageType[] = [...ALL_P2P_DIALOGS, P2PMessageType.channelInit];

    // Listen that other peer want to establish a websocket channel
    this._wss.on<P2PMessage>(EventTypes.p2pMessage)
      .pipe(
        filter(message => !!~initMsgTypes.indexOf(message.message.messageType)),
        pairwise(),
        filter(messages => {
          const [init, start] = messages;
          const [initType, startType] = [init.message.messageType, start.message.messageType];
          const [initId, startId] = [init.uidFrom, start.uidFrom];

          if (initType !== P2PMessageType.channelInit || !~ALL_P2P_DIALOGS.indexOf(startType as P2PDialogType) || initId !== startId) {
            return false;
          }

          return true;
        }),
        map(messages => messages[1])
      )
      .subscribe(msg => {
        const externalReceiver = msg.uidFrom;
        const dialogType: P2PDialogType = msg.message.messageType as P2PDialogType;
        // Create channel and initiate the dialog
        this.createChannel(externalReceiver, true).then(channel => this._p2pDialogs.createDialog(dialogType, channel));
      });
  }

  private _channels: { [key: string]: P2PChannel } = {};
  private _terminators: { [key: string]: Subject<any> } = {};

  private send(receiverId: string, messageContent: P2PMessageContent): void {
    const msg: P2PMessage = this._p2pUtils.createMessage(receiverId, messageContent);
    this._wss.send(EventTypes.p2pMessage, msg);
  }

  private stop(channelId: string, stopReason?: string): void {
    const terminator$: Subject<any> = this._terminators[channelId];
    if (!terminator$) {
      return;
    }

    this._terminators[channelId] = this._channels[channelId] = undefined;
    terminator$.next(stopReason);
    terminator$.complete();
  }

  private async createChannel(receiverId: string, isExternal: boolean): Promise<P2PChannel> {
    const channelId: string = receiverId;
    const currentClientId: string = this._clients.currentClient.uid;

    if (this._channels[channelId]) {
      return this._channels[channelId];
    }

    const terminator$: Subject<any> = new Subject<any>();
    this._terminators[channelId] = terminator$;

    const p2pStream$: Observable<P2PMessage> = this._wss.on<P2PMessage>(EventTypes.p2pMessage);

    const receive$: Observable<P2PMessageContent> = p2pStream$
      .pipe(
        filter(msg => msg.uidTo === currentClientId),
        map(msg => this._p2pUtils.extractMessageContent(msg)),
        takeUntil(terminator$)
      );

    const onStop$ = merge(terminator$, p2pStream$.pipe(
      filter(msg => msg.uidTo === currentClientId && msg.message.messageType === P2PMessageType.channelClose),
      first(),
      map(msg => this._p2pUtils.extractMessageContent(msg)),
      tap(msg => {
        console.log('Stop message');
        console.log(msg);
      }),
    ));

    const svc = this;

    const result: P2PChannel = {
      channelId,
      isExternal,
      send: (msg: P2PMessageContent) => svc.send(receiverId, msg),
      stop: (stopReason?: any) => {
        if (!svc._channels[channelId]) {
          return;
        }

        const messageType: P2PMessageType = P2PMessageType.channelClose;
        const data = stopReason;

        svc.send(receiverId, {messageType, data});
        svc.stop(channelId, stopReason);
      },
      receive$,
      onStop$
    };

    result.onStop$.subscribe(stopReason => {
      if (!this._channels[channelId]) {
        return;
      }
      svc.stop(channelId, stopReason);
    });

    this._channels[channelId] = result;

    if (!isExternal) {
      this.send(receiverId, {messageType: P2PMessageType.channelInit, data: channelId});
    }

    return result;
  }

  /**
   * Create websocket channel between two peers and initiate the dialog
   * @param dialogType
   * @param receiverId
   */
  async startP2PDialog(dialogType: P2PDialogType, receiverId: string): Promise<P2PChannel> {
    const channel: P2PChannel = await this.createChannel(receiverId, false);
    this._p2pDialogs.createDialog(dialogType, channel);
    channel.send({messageType: dialogType, data: ''});
    return channel;
  }
}
