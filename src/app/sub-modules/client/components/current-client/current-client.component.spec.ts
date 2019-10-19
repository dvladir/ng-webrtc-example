import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentClientComponent } from './current-client.component';

describe('CurrentClientComponent', () => {
  let component: CurrentClientComponent;
  let fixture: ComponentFixture<CurrentClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentClientComponent ]
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
