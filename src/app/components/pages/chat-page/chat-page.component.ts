import {Component, ElementRef, Injector, OnInit, ViewChild} from '@angular/core';
import {RtcSessionConfigService} from '../../../sub-modules/p2p/services/rtc-session-config.service';
import {RtcConnection, RtcSessionData} from '../../../sub-modules/p2p';
import {NavigationService} from '../../../services/navigation.service';
import {RtcChatConnection} from './rtc-chat-connection';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {

  constructor(
    private _nav: NavigationService,
    private _rtcSessionConfig: RtcSessionConfigService,
    private _injector: Injector
  ) {
  }

  private _rtc: RtcConnection;

  @ViewChild('local', {static: true})
  private _local: ElementRef<HTMLVideoElement>;

  @ViewChild('remote', {static: true})
  private _remote: ElementRef<HTMLVideoElement>;

  stop(): void {
    this._nav.users();
  }

  ngOnInit(): void {
    const sessionData: RtcSessionData = this._rtcSessionConfig.retrieveSessionData();

    const {p2p, waitTimeout} = sessionData;
    if (!p2p || !waitTimeout) {
      this.stop();
      return;
    }

    this._rtc = new RtcChatConnection(p2p, this._injector, this._remote.nativeElement, this._local.nativeElement);
    if (!p2p.isExternal) {
      this._rtc.initiatePeerConnection();
    }

    p2p.onStop$.subscribe(() => this.stop());
  }

  ngOnDestroy(): void {
    if (this._rtc) {
      this._rtc.close();
      this._rtc = undefined;
    }
  }

}
