import {Injector} from '@angular/core';
import {RtcConfigurationService} from '../services/rtc-configuration.service';
import {P2PChannel} from './p2p-channel';
import {P2PMessageType} from './p2p-message-type.enum';
import {noop} from 'rxjs';
import {MessagesService} from '../../core';

/**
 * Base class that implements common logic of RTCConnection maintenance
 **/
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

  /**
   * Create the RTC Connection and setup the listeners
   * @private
   */
  private initializePeerConnection(): void {
    const iceServers: RTCIceServer[] = this._conf.serverList;
    const conn: RTCPeerConnection = this._rtcPeerConnection = new RTCPeerConnection({iceServers});

    // Need to notify the other peer, about the ICE candidate, that will be used to communicate between peers
    conn.onicecandidate = evt => this.rtcInitIceCandidate(evt);
    conn.oniceconnectionstatechange = evt => this.rtcIceConnStateChange();
    conn.onicegatheringstatechange = noop;
    conn.onsignalingstatechange = () => this.rtcSignalStateChange();

    // Need to send an information to other peer, about RTC connection
    conn.onnegotiationneeded = () => this.rtcOnNegotionNeeded();

    // Proceed the stream from another peer
    conn.ontrack = evt => this.proceedRemoteStream(evt.streams[0]);
  }

  initiatePeerConnection(): Promise<any> {
    this.initializePeerConnection();
    return this.setupLocalStream();
  }

  /**
   * Listen messages from other peer, which are sending through the websockets
   * @protected
   */
  protected initMessages(): void {
    console.log('Init messages');
    this._p2p.receive$.subscribe(msg => {
        switch (msg.messageType) {
          case P2PMessageType.rtcNewICECandidate:
            // Other peer sent an ICE candidate
            const candidate: RTCIceCandidate = msg.data;
            this._rtcPeerConnection.addIceCandidate(candidate).catch(e => this.reportError(e));
            break;
          case P2PMessageType.rtcOffer:
            // Other peer sent an offer to establish the RTC Connection
            // Current peer needs to create and answer and sent it back
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
            // Other peers sent an answer, that he agreed to establish an RTC connection
            const descAnswer: RTCSessionDescription = new RTCSessionDescription(msg.data);
            this._rtcPeerConnection.setRemoteDescription(descAnswer).catch(err => this.reportError(err));
            break;
          case P2PMessageType.rtcClose:
            // Other peer want to close the connection
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
