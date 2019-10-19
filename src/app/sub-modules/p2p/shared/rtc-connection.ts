import {Injector} from '@angular/core';
import {RtcConfigurationService} from '../services/rtc-configuration.service';
import {P2PChannel} from '../shared/p2p-channel';
import {P2PMessageType} from './p2p-message-type.enum';
import {noop} from 'rxjs';
import {MessagesService} from '../../core';

export abstract class RtcConnection {
  constructor(
    protected _p2p: P2PChannel,
    injector: Injector
  ) {
    this._conf = injector.get(RtcConfigurationService);
    this._messages = injector.get(MessagesService);
    this.initMessages();
  }

  protected readonly _conf: RtcConfigurationService;
  protected readonly _messages: MessagesService;
  protected _rtcPeerConnection: RTCPeerConnection;

  get rtcPeerConnection(): RTCPeerConnection {
    return this._rtcPeerConnection;
  }

  protected abstract cleanup(): void;

  protected abstract proceedRemoteStream(stream: MediaStream): void;

  protected abstract setupLocalStream(): Promise<any>;

  protected reportError(err: Error): void {
    this._messages.error(`Error: ${err.name}: ${err.message}`);
  }

  private rtcInitIceCandidate(evt: RTCPeerConnectionIceEvent): void {
    if (!evt.candidate) {
      return;
    }
    const messageType: P2PMessageType = P2PMessageType.rtcNewICECandidate;
    const data: RTCIceCandidate = evt.candidate;
    this._p2p.send({messageType, data});
  }

  private rtcIceConnStateChange(): void {
    switch (this._rtcPeerConnection.iceConnectionState) {
      case 'closed':
      case 'failed':
      case 'disconnected':
        this.close();
        break;
    }
  }

  private rtcSignalStateChange(): void {
    switch (this._rtcPeerConnection.signalingState) {
      case 'closed':
        this.close();
        break;
    }
  }

  private rtcOnNegotionNeeded(): void {
    this._rtcPeerConnection.createOffer()
      .then(offer => {
        this._rtcPeerConnection.setLocalDescription(offer);
        return offer;
      })
      .then(data => {
        const messageType: P2PMessageType = P2PMessageType.rtcOffer;
        this._p2p.send({messageType, data});
      });
  }

  private initializePeerConnection(): void {
    const iceServers: RTCIceServer[] = this._conf.serverList;
    const conn: RTCPeerConnection = this._rtcPeerConnection = new RTCPeerConnection({iceServers});

    conn.onicecandidate = evt => this.rtcInitIceCandidate(evt);
    conn.oniceconnectionstatechange = evt => this.rtcIceConnStateChange();
    conn.onicegatheringstatechange = noop;
    conn.onsignalingstatechange = () => this.rtcSignalStateChange();
    conn.onnegotiationneeded = () => this.rtcOnNegotionNeeded();
    conn.ontrack = evt => this.proceedRemoteStream(evt.streams[0]);
  }

  initiatePeerConnection(): Promise<any> {
    this.initializePeerConnection();
    return this.setupLocalStream();
  }

  protected initMessages(): void {
    console.log('Init messages');
    this._p2p.receive$.subscribe(msg => {
        switch (msg.messageType) {
          case P2PMessageType.rtcNewICECandidate:
            const candidate: RTCIceCandidate = msg.data;
            this._rtcPeerConnection.addIceCandidate(candidate).catch(e => this.reportError(e));
            break;
          case P2PMessageType.rtcOffer:
            if (this._rtcPeerConnection) {
              return;
            }
            this.initializePeerConnection();
            const descOffer: RTCSessionDescription = new RTCSessionDescription(msg.data);
            this._rtcPeerConnection.setRemoteDescription(descOffer)
              .then(() => this.setupLocalStream())
              .then(() => {
                if (!this._rtcPeerConnection) {
                  return undefined;
                }
                return this._rtcPeerConnection.createAnswer();
              })
              .then(answer => {
                if (answer) {
                  this._rtcPeerConnection.setLocalDescription(answer);
                }
                return answer;
              })
              .then(data => {
                if (data) {
                  const messageType: P2PMessageType = P2PMessageType.rtcAnswer;
                  this._p2p.send({messageType, data});
                }
              });
            break;
          case P2PMessageType.rtcAnswer:
            const descAnswer: RTCSessionDescription = new RTCSessionDescription(msg.data);
            this._rtcPeerConnection.setRemoteDescription(descAnswer).catch(err => this.reportError(err));
            break;
          case P2PMessageType.rtcClose:
            this.close();
            break;
        }
    });
  }

  close(): void {
    const conn: any = this._rtcPeerConnection;
    if (conn) {

      conn.onaddstream = null;  // For older implementations
      conn.ontrack = null;      // For newer ones
      conn.onremovestream = null;
      conn.onnicecandidate = null;
      conn.oniceconnectionstatechange = null;
      conn.onsignalingstatechange = null;
      conn.onicegatheringstatechange = null;
      conn.onnotificationneeded = null;
    }

    this.cleanup();

    if (this._rtcPeerConnection) {
      this._rtcPeerConnection.close();
      this._rtcPeerConnection = undefined;
    }

    this._p2p.stop();
  }
}
