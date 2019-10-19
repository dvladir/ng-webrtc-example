import { NgModule } from '@angular/core';
import {CoreModule} from '../core';
import {WebsocketsModule} from '../websockets';
import { CurrentClientComponent } from './components/current-client/current-client.component';
import { ClientsListComponent } from './components/clients-list/clients-list.component';
import { ClientNamePipe } from './pipes/client-name.pipe';



@NgModule({
  declarations: [CurrentClientComponent, ClientsListComponent, ClientNamePipe],
  imports: [
    CoreModule,
    WebsocketsModule
  ],
  exports: [CurrentClientComponent, ClientNamePipe, ClientsListComponent]
})
export class ClientModule { }
