import {Injectable, ViewContainerRef} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OverlayViewRefContainerService {

  constructor() { }

  overlayViewRef: ViewContainerRef;
}
