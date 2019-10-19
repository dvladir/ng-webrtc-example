import {Component, OnInit} from '@angular/core';
import {Client, ClientStateService} from '../../../sub-modules/client';
import {NavigationService} from '../../../services/navigation.service';
import {P2PService} from '../../../sub-modules/p2p/services/p2p.service';
import {P2PMessageType} from '../../../sub-modules/p2p';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(
    private _clientState: ClientStateService,
    private _nav: NavigationService,
    private _p2p: P2PService
  ) { }

  signOut(): void {
    this._clientState.changeClientName('');
    this._nav.login();
  }

  onClientSelect(client: Client): void {
    this._p2p.startP2PDialog(P2PMessageType.startVideo, client.uid);
  }

  ngOnInit() {
  }

}
