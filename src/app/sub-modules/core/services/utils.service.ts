import {Injectable} from '@angular/core';
import {MessagesService} from './messages.service';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

const s4: () => string = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private _notifications: MessagesService
  ) {
  }

  rxHandlerError<T>(returnIfError?: T): (src: Observable<T>) => Observable<T> {
    return (src: Observable<T>) => src
      .pipe(
        catchError(err => {
          this._notifications.error(err);
          return of(returnIfError);
        })
      );
  }

  generateUid(): string {
    return `${s4()}${s4()}-${s4()}`;
  }
}
