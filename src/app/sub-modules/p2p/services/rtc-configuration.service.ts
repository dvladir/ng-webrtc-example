import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RtcConfigurationService {

  constructor() { }

  readonly serverList: RTCIceServer[] = [{
    urls: [
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302'
    ]
  }];

  get isDisplayMediaIsAvailable(): boolean {
    const isGetDisplayMedia = !!(navigator as any).getDisplayMedia;
    const mediaDevices = navigator.mediaDevices as any;
    const isMediaDevicesGetDisplayMedia = !!mediaDevices && mediaDevices.getDisplayMedia || false;
    const isGetUserMedia = !!mediaDevices && !!mediaDevices.getUserMedia;
    return isGetDisplayMedia || isMediaDevicesGetDisplayMedia || isGetUserMedia;
  }
}
