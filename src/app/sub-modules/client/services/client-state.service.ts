import {Injectable, OnDestroy} from '@angular/core';
import {EventTypes, WebsocketService} from '../../websockets';
import {BehaviorSubject, Observable} from 'rxjs';
import {first, map, publishBehavior, refCount} from 'rxjs/operators';
import {Client} from '../shared/client';
import {SessionStorageService, UtilsService} from '../../core';

const CURRENT_CLIENT: string = 'current_client';

@Injectable({
  providedIn: 'root'
})
export class ClientStateService implements OnDestroy {
  constructor(
    private _wss: WebsocketService,
    private _ss: SessionStorageService,
    private _utils: UtilsService,
  ) {
    const currentClient: Client = this.initializeClient();
    this._currentClient$.next(currentClient);
  }

  ngOnDestroy(): void {
    this._currentClient$.complete();
  }


  get currentClient(): Readonly<Client> {
    return this._currentClient$.value;
  }

  private _currentClient$: BehaviorSubject<Client> = new BehaviorSubject<Client>(undefined);

  get currentClient$(): Observable<Readonly<Client>> {
    return this._currentClient$;
  }

  readonly allClients$: Observable<Client[]> = this._wss
    .on<Client[]>(EventTypes.allClients)
    .pipe(
      this._utils.rxHandlerError([]),
      publishBehavior([]),
      refCount()
    );

  private initializeClient(): Client {
    let client: Client = this._ss.getItem<Client>(CURRENT_CLIENT);
    if (!client) {
      const uid: string = this._utils.generateUid();
      const name: string = '';
      client = {uid, name};
      this._ss.setItem<Client>(CURRENT_CLIENT, client);
    }

    this._wss.send(EventTypes.currentClient, client);

    return client;
  }

  changeClientName(name: string): void {
    const client: Client = this._currentClient$.value;
    if (!client) {
      return;
    }
    client.name = name;
    this._ss.setItem(CURRENT_CLIENT, client);
    this._wss.send(EventTypes.changeClientName, name);
    this._currentClient$.next({...client});
  }

  isNameUsed(name: string): Observable<boolean> {
    return this.allClients$
      .pipe(
        first(),
        map(clients => clients.map(c => c.name).filter(x => !!x)),
        map(names => !!~names.indexOf(name))
      );
  }
}
