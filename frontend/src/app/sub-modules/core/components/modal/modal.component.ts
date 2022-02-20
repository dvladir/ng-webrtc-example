import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(
    private _viewContainerRef: ViewContainerRef
  ) { }

  @Input() title: string;

  @Input() useCloseBtn: boolean = true;

  readonly close$: Subject<any> = new Subject<any>();

  onCloseClick(): void {
    this.close$.next();
  }

  ngOnInit() {
    this.close$.complete();
  }

}
