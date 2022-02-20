import {P2PDialogType} from './p2p-dialog-type';
import {P2PChannel} from './p2p-channel';
import {InjectionToken} from '@angular/core';

export const P2P_DIALOG: InjectionToken<P2PDialog[]> = new InjectionToken<P2PDialog[]>('Different types of p2p dialogs');

/**
 * Describes the initial logic of dialog's scenario, that is established between two peers
 * (videochat, audio call, text chat, etc.)
 */
export abstract class P2PDialog {
  abstract readonly dialogType: P2PDialogType;
  abstract openDialog(channel: P2PChannel): void;
}
