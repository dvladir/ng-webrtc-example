import {Injectable, Injector} from '@angular/core';
import {P2PDialogType} from '../shared/p2p-dialog-type';
import {P2P_DIALOG, P2PDialog} from '../shared/p2p-dialog';
import {P2PChannel} from '../shared/p2p-channel';

@Injectable({
  providedIn: 'root'
})
export class P2PDialogsMgmtService {

  constructor(
    private _injector: Injector
  ) {
  }

  private _dialogs: Map<P2PDialogType, P2PDialog> = new Map<P2PDialogType, P2PDialog>();

  createDialog(dialogType: P2PDialogType, _channel: P2PChannel): void {
    if (!this._dialogs.has(dialogType)) {
      const dialogs: P2PDialog[] = this._injector.get(P2P_DIALOG);

      dialogs
        .filter(d => !this._dialogs.has(d.dialogType))
        .forEach(d => this._dialogs.set(d.dialogType, d));

      if (!this._dialogs.has(dialogType)) {
        return;
      }
    }

    this._dialogs.get(dialogType).openDialog(_channel);
  }
}
