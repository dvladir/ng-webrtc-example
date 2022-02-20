import {P2PDialogType} from './p2p-dialog-type';
import {P2PChannel} from './p2p-channel';
import {InjectionToken} from '@angular/core';

export const P2P_DIALOG: InjectionToken<P2PDialog[]> = new InjectionToken<P2PDialog[]>('Different types of p2p dialogs');

export abstract class P2PDialog {
  abstract readonly dialogType: P2PDialogType;
  abstract openDialog(channel: P2PChannel): void;
}
