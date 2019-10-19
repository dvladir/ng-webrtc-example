import {Directive, Host, Self} from '@angular/core';
import {ModalComponent} from '../components/modal/modal.component';

@Directive({
  selector: 'app-modal'
})
export class ModalRefDirective {

  constructor(
    @Host() @Self() public readonly modalComponent: ModalComponent
  ) { }

}
