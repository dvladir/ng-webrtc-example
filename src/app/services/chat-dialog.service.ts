import {Injectable} from '@angular/core';
import {BaseRtcDialogService, P2PMessageType} from '../sub-modules/p2p';
import {MessagesService} from '../sub-modules/core';
import {RtcSessionConfigService} from '../sub-modules/p2p/services/rtc-session-config.service';
import {ClientStateService} from '../sub-modules/client';
import {NavigationService} from './navigation.service';
import {first, map} from 'rxjs/operators';

@Injectable()
export class ChatDialogService extends BaseRtcDialogService {

  constructor(
    messages: MessagesService,
    rtcSessionConfig: RtcSessionConfigService,
    private _clientState: ClientStateService,
    private _nav: NavigationService
  ) {
    super(P2PMessageType.startVideo, messages, rtcSessionConfig);
  }

  protected continueOfferAcception(): void {
    this._nav.chat();
  }

  protected onOfferAccepted(): void {
    this._nav.chat();
  }

  protected async msgAlreadyStop(): Promise<string> {
    return 'Chat session has already been stopped';
  }

  protected async msgQuestionProceed(responderId: string): Promise<string> {
    const responderName: string = await this._clientState.allClients$
      .pipe(
        map(clients => clients.find(c => c.uid === responderId)),
        map(c => c && c.name || ''),
        first()
      ).toPromise();

    return `The user "${responderName}" wants to start a chat with you. Do you want to proceed?`;
  }

  protected async msgStop(): Promise<string> {
    return 'Chat session was stopped';
  }

  protected async msgTimeout(): Promise<string> {
    return 'Chat session was stopped because of timeout';
  }

}
