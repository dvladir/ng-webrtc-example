import {Component, OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Client} from '../../shared/client';
import {ClientStateService} from '../../services/client-state.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-current-client',
  templateUrl: './current-client.component.html',
  styleUrls: ['./current-client.component.css']
})
export class CurrentClientComponent implements OnDestroy {

  constructor(
    clientState: ClientStateService
  ) {
    this.currentClient$ = clientState.currentClient$
      .pipe(
        takeUntil(this._terminator$)
      );
  }

  readonly currentClient$: Observable<Client>;

  private _terminator$: Subject<any> = new Subject<any>();

  ngOnDestroy(): void {
    this._terminator$.next();
    this._terminator$.complete();
  }

}
