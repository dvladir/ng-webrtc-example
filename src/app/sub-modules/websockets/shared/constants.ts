import {InjectionToken} from '@angular/core';

export const DEF_PING_INTERVAL: number = 30000;
export const DEF_RECONNECT_INTERVAL: number = 5000;
export const DEF_RECONNECT_ATTEMPTS: number = 10;
export const DEF_URL: InjectionToken<string> = new InjectionToken<string>('Default endpoint url');
