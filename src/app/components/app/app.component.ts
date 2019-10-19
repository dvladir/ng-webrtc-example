import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from '../../sub-modules/websockets';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ModalService, MessagesService} from '../../sub-modules/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    this._router.initialNavigation();
  }

  /*constructor(
    private _ws: WebsocketService,
    private _modal: ModalService,
    private _messages: MessagesService
  ) {
  }

  title = 'front';

  private _terminator$: Subject<any> = new Subject<any>();

  send(ipt: HTMLInputElement): void {
    const myData: string = ipt.value;
    this._ws.send('test_msg', {myData, x: true});
  }

  ngOnDestroy(): void {
    this._terminator$.next();
    this._terminator$.complete();
  }

  showModal(): void {
    this._messages.confirm('Are you agree?').then(isOk => console.log(isOk ? 'Agreed' : 'Not agreed'));
  }

  ngOnInit(): void {
    this._ws.on<any>('test_msg')
      .pipe(
        takeUntil(this._terminator$)
      )
      .subscribe(x => console.log(x));
  }

  error(): void {
    this._messages.error('Test error');
  }

  warn(): void {
    this._messages.warn('Test warn');
  }

  info(): void {
    this._messages.info('Test info');
  }

  success(): void {
    this._messages.success('Test success');
  }*/

}
