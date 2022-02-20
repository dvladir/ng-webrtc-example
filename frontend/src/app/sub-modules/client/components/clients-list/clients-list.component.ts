import {Component, EventEmitter, OnDestroy, Output, TrackByFunction} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Client} from '../../shared/client';
import {ClientStateService} from '../../services/client-state.service';
import {ClientNamePipe} from '../../pipes/client-name.pipe';
import {map, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css']
})
export class ClientsListComponent implements OnDestroy {

  constructor(
    clientState: ClientStateService
  ) {
    this.clients$ = clientState.allClients$.pipe(
      map(clients => clients.filter(c => c.uid !== clientState.currentClient.uid)),
      takeUntil(this._terminator$)
    );
  }

  @Output() clientSelect: EventEmitter<Client> = new EventEmitter<Client>();

  readonly clients$: Observable<Client[]>;

  private _terminator$: Subject<any> = new Subject<any>();

  readonly trackByFn: TrackByFunction<Client> = (index: number, client: Client) => ClientNamePipe.transform(client);

  onRowClick(client: Client): void {
    if (!client.name) {
      return;
    }
    this.clientSelect.emit(client);
  }

  ngOnDestroy(): void {
    this._terminator$.next();
    this._terminator$.complete();
  }

}
