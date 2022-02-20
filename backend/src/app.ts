import * as e from 'express';
import * as http from 'http';
import * as ews from 'express-ws';
import * as ws from 'ws';
import {Client} from './shared/client';
import {ClientStorage} from './utils/client-storage';
import {WsMessage} from './shared/ws-message';
import {EventTypes} from './shared/event-types.enum';
import {P2PMessage} from './shared/p2p-message';

const app: e.Express = e();
const server: http.Server = http.createServer(app);
const appWs: ews.Instance = ews(app, server);

function getClientName(c: Client): string {
  const {uid, name} = c;
  return !!name ? `${name} (${uid})` : uid;
}

function registerClient(socket: ws, client: Client): void {
    const c: Client = ClientStorage.instance.register(socket, client);
    console.log(`Client: ${getClientName(c)} registered.`);
    sendCurrentClient(c);
    sendClientsListToAll();
}

function unregisterClient(socket: ws): void {
    const client: Client = ClientStorage.instance.getClient(socket);
    if (client) {
        ClientStorage.instance.unregister(socket);
        console.log(`Client: ${getClientName(client)} unregistered.`);
    }
}

function ping(socket: ws) {
  const client: Client = ClientStorage.instance.getClient(socket);
  if (client) {
    console.log(`Ping from: ${getClientName(client)}`);
  }
}

function sendCurrentClient(client: Client): void {
    const {uid, name, socket} = client;
    const data: Client = {uid, name};
    const event: EventTypes = EventTypes.currentClient;
    const msg: WsMessage<Client> = {event, data};
    socket.send(JSON.stringify(msg));
}

function changeClientName(socket: ws, name: string) {
    const client: Client = ClientStorage.instance.getClient(socket);
    if (!!client) {
        client.name = name;
        sendCurrentClient(client);
    }
    sendClientsListToAll();
}

function sendClientsListToAll(): void {
    const clients: Client[] = ClientStorage.instance.getAll();
    const {data, sockets} = clients.reduce((res, item) => {

        const {uid, name, socket} = item;
        const c: Client = {uid, name};

        res.data.push(c);
        res.sockets.push(socket);

        return res;
    }, {data: [], sockets: []});

    const event: EventTypes = EventTypes.allClients;
    const msg: WsMessage<Client[]> = {event, data};
    const msgString: string = JSON.stringify(msg);

    sockets.forEach(s => {
        if (s.readyState === ws.OPEN) {
            s.send(msgString);
        }
    });
}

function proceedP2PMessage(socket: ws, p2pMessage: P2PMessage): void {
    const {uidTo, message} =  p2pMessage;
    const from: Client = ClientStorage.instance.getClient(socket);
    const to: Client = ClientStorage.instance.getClient(uidTo);
    const uidFrom: string = from && from.uid || undefined;

    if (!uidTo || !uidFrom || !to) {
        return;
    }

    const event: EventTypes = EventTypes.p2pMessage;
    const data: P2PMessage = {uidTo, uidFrom, message};
    const msg: WsMessage<P2PMessage> = {event, data};
    const msgStr: string = JSON.stringify(msg);
    to.socket.send(msgStr);
}

function notify(msg: any): void {
   ClientStorage.instance.getAll().forEach(client => {
       console.log(`Send to ${client.name || client.uid}: ${msg}`);
       client.socket.send(msg);
   });
}

appWs.app.ws('/endpoint', (webSocket: ws) => {


    const closeListener = () => {
        unregisterClient(webSocket);
        webSocket.removeEventListener('close', closeListener);
        sendClientsListToAll();
    };
    webSocket.addEventListener('close', closeListener);

    webSocket.on('message', (msg: string) => {

        let wsMessage: WsMessage<any>;
        try {
            wsMessage = JSON.parse(msg) as WsMessage<any>;
        } catch (e) {
            return;
        }

        if (!wsMessage) {
            return;
        }

        switch (wsMessage.event) {
            case EventTypes.currentClient:
                registerClient(webSocket, wsMessage.data);
                break;
            case EventTypes.changeClientName:
                changeClientName(webSocket, wsMessage.data);
                break;
            case EventTypes.p2pMessage:
                proceedP2PMessage(webSocket, wsMessage.data);
                break;
          case EventTypes.ping:
                ping(webSocket);
                break;
            default:
                notify(msg);
                break;
        }
    });
});

server.listen(process.env.PORT || 3000);
// @ts-ignore
console.log(`Server started on port ${server.address().port}`);
