import { NgModule } from '@angular/core';
import {CoreModule} from '../core';
import {WebsocketsModule} from '../websockets';
import {ClientModule} from '../client';

@NgModule({
  declarations: [],
  imports: [
    CoreModule,
    WebsocketsModule,
    ClientModule
  ]
})
export class P2PModule { }
