import {Component, OnInit} from '@angular/core';
import {Modal} from '../../shared/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent extends Modal implements OnInit {

  constructor() {
    super();
  }

  confirm(): void {
    this.returnValue = true;
    this.close();
  }

  reject(): void {
    this.returnValue = false;
    this.close();
  }

  ngOnInit() {
  }

}
