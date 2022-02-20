import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RtcConfigurationService {

  constructor() {
  }

  /**
   * List of stun and turn servers, to avoid network restriction while working with two peers
   * https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Protocols
   **/
  readonly serverList: RTCIceServer[] = [{
    urls: [
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302'
    ]
  },
    {
      urls: ['turn:turn.bistri.com:80'],
      credential: 'homeo',
      username: 'homeo'
    },
    {
      urls: ['turn:turn.anyfirewall.com:443?transport=tcp'],
      credential: 'webrtc',
      username: 'webrtc'
    }];

  get isDisplayMediaIsAvailable(): boolean {
    const isGetDisplayMedia = !!(navigator as any).getDisplayMedia;
    const mediaDevices = navigator.mediaDevices as any;
    const isMediaDevicesGetDisplayMedia = !!mediaDevices && mediaDevices.getDisplayMedia || false;
    const isGetUserMedia = !!mediaDevices && !!mediaDevices.getUserMedia;
    return isGetDisplayMedia || isMediaDevicesGetDisplayMedia || isGetUserMedia;
  }
}
