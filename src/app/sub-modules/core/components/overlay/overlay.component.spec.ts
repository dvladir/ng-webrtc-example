import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayComponent } from './overlay.component';
import {OverlayViewRefContainerService} from '../../services/overlay-view-ref-container.service';
import {ViewContainerRef} from '@angular/core';

describe('OverlayComponent', () => {
  let component: OverlayComponent;
  let fixture: ComponentFixture<OverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [OverlayViewRefContainerService, {provide: ViewContainerRef, useValue: 'foo'}],
      declarations: [ OverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
