import {ModuleWithProviders, NgModule} from '@angular/core';
import {CoreModule} from '../core';
import {WebSocketConfig} from './shared/web-socket-config';
import {WebsocketService} from './services/websocket.service';

@NgModule({
  declarations: [],
  imports: [
    CoreModule
  ]
})
export class WebsocketsModule {
  static forRoot(wsConfig: WebSocketConfig): ModuleWithProviders {
    return {
      ngModule: WebsocketsModule,
      providers: [
        {
          provide: WebSocketConfig,
          useValue: wsConfig
        },
        WebsocketService
      ]
    };
  }
}
