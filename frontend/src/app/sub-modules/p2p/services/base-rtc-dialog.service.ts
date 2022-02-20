import {noop, Subscription, timer} from 'rxjs';
import {filter, first, map, takeUntil} from 'rxjs/operators';
import {MessagesService} from '../../core';
import {P2PMessageContent} from '../shared/p2p-message';
import {P2PDialog} from '../shared/p2p-dialog';
import {P2PDialogType} from '../shared/p2p-dialog-type';
import {P2PStopReason} from '../shared/p2p-stop-reason.enum';
import {P2PChannel} from '../shared/p2p-channel';
import {P2PMessageType} from '../shared/p2p-message-type.enum';
import {RtcSessionConfigService} from './rtc-session-config.service';

export abstract class BaseRtcDialogService implements P2PDialog {

  protected constructor(
    public readonly dialogType: P2PDialogType,
    private _messages: MessagesService,
    private _rtcSessionConfig: RtcSessionConfigService
  ) {
  }

  protected readonly _waitTimeout: number = 60000;

  protected _isDialogOpened: boolean = false;

  protected abstract msgTimeout(): Promise<string>;

  protected abstract msgStop(): Promise<string>;

  protected abstract msgAlreadyStop(): Promise<string>;

  protected abstract msgQuestionProceed(responderId: string): Promise<string>;

  protected abstract continueOfferAcception(): void;

  protected abstract onOfferAccepted(): void;

  private async showStopMessage(stopReason?: P2PStopReason): Promise<any> {
    const message: string = stopReason === P2PStopReason.timeout ?
      await this.msgTimeout() :
      await this.msgStop();
    this._messages.info(message);
  }


  private async proceedOffer(channel: P2PChannel): Promise<any> {
    if (this._isDialogOpened) {
      return undefined;
    }

    this._isDialogOpened = true;

    let isStopped: boolean = false;
    const sStop: Subscription = channel.onStop$.subscribe(stopReason => {
      this.showStopMessage(stopReason);
      this._isDialogOpened = false;
      isStopped = true;
    }, noop);

    const message: string = await this.msgQuestionProceed(channel.channelId);
    const isOk: boolean = await this._messages.confirm(message);

    if (!isOk) {
      this._isDialogOpened = false;
      channel.send({messageType: P2PMessageType.reject, data: ''});
      sStop.unsubscribe();
      return undefined;
    }

    if (isStopped) {
      this._isDialogOpened = false;
      const stopMsg: string = await this.msgAlreadyStop();
      this._messages.info(stopMsg);
      return undefined;
    }

    this._rtcSessionConfig.configSession({p2p: channel, waitTimeout: this._waitTimeout});
    this.continueOfferAcception();
    channel.send({messageType: P2PMessageType.accept, data: ''});
  }

  private async createOffer(channel: P2PChannel): Promise<any> {
    if (this._isDialogOpened) {
      return;
    }

    const timeout$ = timer(this._waitTimeout);
    timeout$
      .pipe(takeUntil(channel.receive$))
      .subscribe(() => channel.stop(P2PStopReason.timeout));

    const receive$ = channel.receive$
      .pipe(
        filter((msg: P2PMessageContent) => msg.messageType === P2PMessageType.accept || msg.messageType === P2PMessageType.reject),
        first(),
        map((msg: P2PMessageContent) => msg.messageType),
        takeUntil(timeout$)
      );

    let isStopped: boolean = false;
    channel.onStop$.subscribe(stopReason => {
      this.showStopMessage(stopReason);
      this._isDialogOpened = false;
      isStopped = true;
    });

    const stopMsg: string = await this.msgAlreadyStop();

    receive$
      .subscribe(messageType => {
        if (messageType === P2PMessageType.reject) {
          channel.stop();
          return;
        } else if (messageType === P2PMessageType.accept) {
          if (isStopped) {
            this._messages.info(stopMsg);
          } else {
            this._rtcSessionConfig.configSession({p2p: channel, waitTimeout: this._waitTimeout});
            this.continueOfferAcception();
          }
        }
      }, noop);
  }

  openDialog(channel: P2PChannel): void {
    if (channel.isExternal) {
      this.proceedOffer(channel);
    } else {
      this.createOffer(channel);
    }
  }

}
