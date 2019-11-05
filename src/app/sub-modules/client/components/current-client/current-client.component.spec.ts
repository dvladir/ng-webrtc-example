import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentClientComponent } from './current-client.component';
import {ClientNamePipe} from '../../pipes/client-name.pipe';

describe('CurrentClientComponent', () => {
  let component: CurrentClientComponent;
  let fixture: ComponentFixture<CurrentClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentClientComponent, ClientNamePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
