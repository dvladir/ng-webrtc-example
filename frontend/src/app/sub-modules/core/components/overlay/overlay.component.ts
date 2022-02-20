import {AfterViewInit, Component, ViewContainerRef} from '@angular/core';
import {OverlayViewRefContainerService} from '../../services/overlay-view-ref-container.service';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent implements AfterViewInit {

  constructor(
    private _overlayViewRefContainer: OverlayViewRefContainerService,
    private _viewContainerRef: ViewContainerRef
  ) {
  }

  ngAfterViewInit(): void {
    this._overlayViewRefContainer.overlayViewRef = this._viewContainerRef;
  }

}
