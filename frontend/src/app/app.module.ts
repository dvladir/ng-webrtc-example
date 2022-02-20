import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './components/app/app.component';
import {CoreModule} from './sub-modules/core';
import {DEF_URL, WebsocketsModule} from './sub-modules/websockets';
import {environment} from '../environments/environment';
import {ClientModule} from './sub-modules/client';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './components/pages/login/login.component';
import {UserListComponent} from './components/pages/user-list/user-list.component';
import {P2P_DIALOG} from './sub-modules/p2p/shared/p2p-dialog';
import { ChatPageComponent } from './components/pages/chat-page/chat-page.component';
import {ChatDialogService} from './services/chat-dialog.service';

export function prodUrl(): string {
  const protocol = location.protocol.includes('https') ? 'wss' : 'ws';
  return `${protocol}://${location.host}/backend/endpoint`;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserListComponent,
    ChatPageComponent
  ],
  imports: [
    CoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    WebsocketsModule.forRoot({url: environment.ws }),
    ClientModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: DEF_URL,
      useFactory: prodUrl
    },
    {
      provide: P2P_DIALOG,
      useClass: ChatDialogService,
      multi: true
    }
  ]
})
export class AppModule {
}
