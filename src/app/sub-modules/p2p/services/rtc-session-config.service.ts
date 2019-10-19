import {Injectable} from '@angular/core';
import {RtcSessionData} from '../shared/rtc-session-data';

@Injectable({
  providedIn: 'root'
})
export class RtcSessionConfigService {

  constructor() {
  }

  private _data: RtcSessionData;

  retrieveSessionData(): RtcSessionData {
    const result: RtcSessionData = this._data;
    this._data = undefined;
    return result;
  }

  configSession(data: RtcSessionData): void {
    this._data = data;
  }
}
