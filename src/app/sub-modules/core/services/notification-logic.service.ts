import {Injectable, OnDestroy} from '@angular/core';
import {merge, Observable, Subject} from 'rxjs';
import {map, scan, tap} from 'rxjs/operators';
import {Message} from '../shared/message';

export enum SignalType {
  add,
  remove,
  remove_all
}

export interface Signal {
  message: Message;
  sigType: SignalType;
}

export const MSG_TTL: number = 30000;

@Injectable({
  providedIn: 'root'
})
export class NotificationLogicService implements OnDestroy {

  constructor() {
  }

  private _removeAll$: Subject<Message> = new Subject<Message>();
  private _addMessage$: Subject<Message> = new Subject<Message>();
  private _removeMessages$: Subject<Message> = new Subject<Message>();

  private _sigRemoveAll$: Observable<Signal> = this._removeAll$.pipe(this.createSignal(SignalType.remove_all));
  private _sigAddMessage$: Observable<Signal> = this._addMessage$.pipe(this.createSignal(SignalType.add));
  private _sigRemoveMessage$: Observable<Signal> = this._removeMessages$.pipe(this.createSignal(SignalType.remove));

  readonly messages$: Observable<Message[]> = merge(this._sigAddMessage$, this._sigRemoveMessage$, this._sigRemoveAll$)
    .pipe(
      scan<Signal, Message[]>((acc: Message[], sig: Signal) => {
        switch (sig.sigType) {
          case SignalType.remove_all:
            acc.length = 0;
            break;
          case SignalType.remove:
            const index: number = acc.indexOf(sig.message);
            if (!!~index) {
              acc.splice(index, 1);
            }
            break;
          case SignalType.add:
            const hasDuplicate: boolean = !!acc.find(m => m.msgType === sig.message.msgType && m.text === sig.message.text);
            if (!hasDuplicate) {
              acc.unshift(sig.message);
            }
            break;
        }

        return acc;
      }, []),
      map((msg: Message[]) => msg.slice(0, 6))
    );

  addMessage(message: Message, ttl: number = MSG_TTL): void {
    this._addMessage$.next(message);
    setTimeout(() => this._removeMessages$.next(message), ttl);
  }

  removeMessage(message: Message): void {
    this._removeMessages$.next(message);
  }

  removeAll(): void {
    this._removeAll$.next(undefined);
  }

  private createSignal(sigType: SignalType): (src: Observable<Message>) => Observable<Signal> {
    return (src: Observable<Message>) => src.pipe(map(message => ({message, sigType})));
  }

  ngOnDestroy(): void {
    this._removeAll$.complete();
    this._addMessage$.complete();
    this._removeMessages$.complete();
  }
}
