import {Client} from '../shared/client';
import * as ws from 'ws';
import {nanoid} from 'nanoid';

const _WS_UID: symbol = Symbol('_ws_uid');

export class ClientStorage {
  private constructor() {
  }

  private static _instance: ClientStorage;

  static get instance(): ClientStorage {
    if (!this._instance) {
      this._instance = new ClientStorage();
    }
    return this._instance;
  }

  private _clients: { [uid: string]: Client } = {};

  getClient(socket: ws): Client;
  getClient(uid: string): Client;
  getClient(uidOrSocket: string | ws): Client {
    if (typeof uidOrSocket === 'string') {
      return this._clients[uidOrSocket as string];
    }

    const socket: ws = uidOrSocket as ws;
    const uid: string = (socket as any)[_WS_UID] as string;

    if (!uid) {
      return undefined;
    }

    return this.getClient(uid);
  }

  register(socket: ws, client?: Client): Client {
    let uid: string = (socket as any)[_WS_UID] as string;
    uid = client && client.uid || uid || nanoid();
    if (!(socket as any)[_WS_UID]) {
      (socket as any)[_WS_UID] = uid;
    }

    if (!this._clients[uid]) {
      const name: string = client && client.name || '';
      this._clients[uid] = {uid, name, socket};
    }

    return this._clients[uid];
  }

  unregister(socket: ws): void;
  unregister(uid: string): void;
  unregister(uidOrSocket: string | ws): void {
    if (typeof uidOrSocket === 'string') {
      delete this._clients[uidOrSocket as string];
      return;
    }

    const socket: ws = uidOrSocket as ws;
    const uid: string = (socket as any)[_WS_UID] as string;

    if (!uid) {
      return;
    }

    this.unregister(uid);
  }

  getAll(): Client[] {
    return Object.values(this._clients);
  }

}
