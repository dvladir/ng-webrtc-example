import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service';
import {OverlayViewRefContainerService} from './overlay-view-ref-container.service';
import {ComponentFactoryResolver, ViewContainerRef} from '@angular/core';


describe('ModalService', () => {

  const spyComponentFactory = jasmine.createSpyObj('ComponentFactoryResolver', ['resolveComponentFactory']);

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      OverlayViewRefContainerService,
      {provide: ComponentFactoryResolver, useValue: spyComponentFactory}
    ]
  }));

  it('should be created', () => {
    const service: ModalService = TestBed.get(ModalService);
    expect(service).toBeTruthy();
  });
});
