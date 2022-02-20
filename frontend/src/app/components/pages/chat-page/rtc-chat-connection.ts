import {Injector} from '@angular/core';
import {P2PChannel, RtcConnection} from '../../../sub-modules/p2p';

export class RtcChatConnection extends RtcConnection {

  constructor(
    p2p: P2PChannel,
    injector: Injector,
    private _remoteVideo: HTMLVideoElement,
    private _localVideo: HTMLVideoElement
  ) {
    super(p2p, injector);
  }

  private _localActiveStream: MediaStream;
  private _remoteActiveStream: MediaStream;

  private cleanupActiveStream(): void {
    const streams: MediaStream[] = [this._localActiveStream, this._remoteActiveStream];
    streams.filter(s => !!s).forEach(s => s.getTracks().forEach(t => t.stop()));
    this._localActiveStream = this._remoteActiveStream = undefined;
  }

  private handleGetUserMediaError(err: Error): void {
    switch (err.name) {
      case 'NotFoundError':
        this._messages.error('Unable to open your call because no camera and/or microphone were found.');
        break;
      case 'SecurityError':
      case 'PermissionDeniedError':
        // The same as user cancel the call
        break;
      default:
        this._messages.error(`Error opening your camera and/or microphone: ${err.message}`);
        break;
    }

    this.close();
  }

  protected cleanup(): void {
    this.cleanupActiveStream();
  }

  protected proceedRemoteStream(stream: MediaStream): void {
    this._remoteVideo.srcObject = stream;
  }

  protected async setupLocalStream(): Promise<any> {
    try {

      this.cleanupActiveStream();

      const remoteStream: MediaStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
      const localStream: MediaStream = remoteStream.clone();
      const audioTracks: MediaStreamTrack[] = localStream.getAudioTracks();
      audioTracks.forEach(t => {
        localStream.removeTrack(t);
        t.stop();
      });

      this._localActiveStream = localStream;
      this._remoteActiveStream = remoteStream;

      const rtc: any = this.rtcPeerConnection;

      if (!rtc) {
        this.cleanupActiveStream();
        return false;
      }

      if (rtc.addTrack !== undefined) {
        this._remoteActiveStream.getTracks().forEach(t => rtc.addTrack(t, this._remoteActiveStream));
      } else {
        rtc.addStream(this._remoteActiveStream);
      }

      this._localVideo.srcObject = this._localActiveStream;

    } catch (e) {
      this.handleGetUserMediaError(e);
      return false;
    }

    return true;
  }

}
