import {noop, Subject} from 'rxjs';
import {AfterViewInit, OnDestroy, QueryList, ViewChildren} from '@angular/core';
import {ModalRefDirective} from '../directives/modal-ref.directive';
import {ModalComponent} from '../components/modal/modal.component';
import {takeUntil} from 'rxjs/operators';

export abstract class Modal implements AfterViewInit, OnDestroy {

  data: any;
  returnValue: any;

  private _onClose: () => void = noop;
  private _terminator$: Subject<any> = new Subject<any>();

  @ViewChildren(ModalRefDirective)
  private _modalRef: QueryList<ModalRefDirective>;

  close(): void {
    this._onClose();
  }

  ngOnDestroy(): void {
    this._onClose = noop;
    this._terminator$.next();
    this._terminator$.complete();
  }

  ngAfterViewInit(): void {
    const modalRef: ModalRefDirective = this._modalRef && this._modalRef.first || undefined;
    const modalComponent: ModalComponent = modalRef && modalRef.modalComponent || undefined;
    if (!modalComponent) {
      modalComponent.close$
        .pipe(takeUntil(this._terminator$))
        .subscribe(() => this.close());
    }
  }
}
