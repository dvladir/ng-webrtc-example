import * as ws from 'ws';

export interface Client {
    uid: string;
    name: string;
    socket?: ws;
}

