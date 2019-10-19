import {Inject, Injectable, OnDestroy, Optional} from '@angular/core';
import {BehaviorSubject, interval, Observable, Subject, timer} from 'rxjs';
import {WebSocketSubject, WebSocketSubjectConfig} from 'rxjs/webSocket';
import {distinctUntilChanged, filter, map, takeUntil, takeWhile} from 'rxjs/operators';
import {assert, MessagesService} from '../../core';
import {WsMessage} from '../shared/ws-message';
import {WebSocketConfig} from '../shared/web-socket-config';
import {EventTypes} from '../shared/event-types.enum';
import {DEF_PING_INTERVAL, DEF_RECONNECT_ATTEMPTS, DEF_RECONNECT_INTERVAL, DEF_URL} from '../shared/constants';

@Injectable()
export class WebsocketService implements OnDestroy {

  constructor(
    private _notifications: MessagesService,
    wsConfig: WebSocketConfig,
    @Optional() @Inject(DEF_URL) defaultUrl: string
  ) {
    this._reconnectInterval = wsConfig.reconnectInterval || DEF_RECONNECT_INTERVAL;
    this._reconnectAttempts = wsConfig.reconnectAttempts || DEF_RECONNECT_ATTEMPTS;
    this._pingInterval = (!!wsConfig.pingInterval || wsConfig.pingInterval === 0) ? wsConfig.pingInterval : DEF_PING_INTERVAL;
    const url: string = wsConfig.url || defaultUrl;

    this._config = {
      url,
      closeObserver: {
        next: (event: CloseEvent) => {
          this._websocket$.complete();
          this._websocket$ = undefined;
          this._isConnected$.next(false);
        }
      },
      openObserver: {
        next: (event: Event) => {
          this._notifications.success('Websocket connected!');
          this._isConnected$.next(true);

          if (this._pingInterval) {
            timer(this._pingInterval)
              .pipe(takeUntil(this._terminator$))
              .subscribe(() => this.send(EventTypes.ping));
          }

        }
      }
    };

    const connectionStatus$: Observable<boolean> = this._isConnected$
      .pipe(
        distinctUntilChanged(),
        filter(v => typeof v === 'boolean')
      );

    connectionStatus$.subscribe(isConnected => {
      if (!this._reconnection$ && !isConnected) {
        this.reconnect();
      }
    });

    this.connect();

  }

  private readonly _reconnectInterval: number;
  private readonly _reconnectAttempts: number;
  private readonly _pingInterval: number;
  private readonly _config: WebSocketSubjectConfig<WsMessage<any>>;
  private _websocket$: WebSocketSubject<WsMessage<any>>;
  private _wsMessage$: Subject<WsMessage<any>> = new Subject<WsMessage<any>>();
  private _isConnected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);
  private _terminator$: Subject<any> = new Subject<any>();
  private _reconnection$: Observable<any>;

  private connect(): void {
    this._websocket$ = new WebSocketSubject<WsMessage<any>>(this._config);
    this._websocket$.subscribe(
      message => this._wsMessage$.next(message),
      error => {
        if (!this._websocket$) {
          this.reconnect();
        }
      }
    );
  }

  private reconnect(): void {
    this._reconnection$ = interval(this._reconnectInterval)
      .pipe(
        takeWhile((v, index) => index < this._reconnectAttempts && !this._websocket$)
      );

    this._reconnection$.subscribe({
      next: () => this.connect(),
      complete: () => {
        this._reconnection$ = null;
        if (!this._websocket$) {
          this.completeAll();
        }
      }
    });
  }

  private completeAll(): void {
    this._isConnected$.complete();
    this._wsMessage$.complete();
    if (this._websocket$) {
      this._websocket$.complete();
    }
    this._terminator$.next();
    this._terminator$.complete();
  }

  on<T>(event: string): Observable<T> {
    assert(!!event, 'WebsocketService.on: event should be defined');

    return this._wsMessage$
      .pipe(
        filter(msg => msg && msg.event === event),
        map(msg => msg.data)
      );
  }

  send(event: string, data: any = {}): void {
    if (!event || !this._isConnected$.value) {
      if (console) {
        console.log('Send error!');
      }
    }
    this._websocket$.next({event, data});
  }

  ngOnDestroy(): void {
    this.completeAll();
  }
}
