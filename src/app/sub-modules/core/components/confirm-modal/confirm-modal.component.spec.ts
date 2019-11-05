import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmModalComponent } from './confirm-modal.component';
import {Component} from '@angular/core';

@Component({selector: 'app-modal', template: '<ng-content></ng-content>'})
class ModalStubComponent {}

@Component({selector: 'app-modal-content', template: '<ng-content></ng-content>'})
class ModalContentStubComponent {}

@Component({selector: 'app-modal-footer', template: '<ng-content></ng-content>'})
class ModalFooterStubComponent {}

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmModalComponent, ModalStubComponent, ModalContentStubComponent, ModalFooterStubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
