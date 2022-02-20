import {Injector} from '@angular/core';
import {P2PChannel, RtcConnection} from '../../../sub-modules/p2p';

/**
 * Setup RTC Connection for Video Chat
 */
export class RtcChatConnection extends RtcConnection {

  constructor(
    p2p: P2PChannel,
    injector: Injector,
    /**
     * HTML element to display other peers video, received through RTC connection
     */
    private _remoteVideo: HTMLVideoElement,

    /**
     * HTML element to display current peer video from local device
     */
    private _localVideo: HTMLVideoElement
  ) {
    super(p2p, injector);
  }

  /**
   * Media stream that will be linked with _localVideo
   * @private
   */
  private _localActiveStream: MediaStream;

  /**
   * Media stream that will be send to remote peer
   * @private
   */
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

  /**
   * Link remote peer's stream from RTC Connection to _remoteVideo element
   * @param stream - remote peer's strem
   * @protected
   */
  protected proceedRemoteStream(stream: MediaStream): void {
    this._remoteVideo.srcObject = stream;
  }

  /**
   * Setup stream from local device
   * @protected
   */
  protected async setupLocalStream(): Promise<any> {
    try {

      this.cleanupActiveStream();

      // Capture stream from media device
      const remoteStream: MediaStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});

      // To display our own video, we can't use the same stream, that we are going to send though RTC
      // Instead we need to duplicate it, and remove any audio information
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

      // Add stream to RTC Connection
      // Both addTrack and addStream do the same
      // addStream is obsolete, but some browser might support it instead of addTrack
      if (rtc.addTrack !== undefined) {
        this._remoteActiveStream.getTracks().forEach(t => rtc.addTrack(t, this._remoteActiveStream));
      } else {
        rtc.addStream(this._remoteActiveStream);
      }

      // Display our local video
      this._localVideo.srcObject = this._localActiveStream;

    } catch (e) {
      this.handleGetUserMediaError(e);
      return false;
    }

    return true;
  }

}
