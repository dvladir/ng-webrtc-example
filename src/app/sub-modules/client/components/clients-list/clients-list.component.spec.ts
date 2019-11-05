import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsListComponent } from './clients-list.component';
import {Observable, of} from 'rxjs';
import {Client} from '../../shared/client';
import {ClientStateService} from '../../services/client-state.service';
import {ClientNamePipe} from '../..';

export class MockClientStateService {
  allClients$: Observable<Client[]> = of([]);
}

describe('ClientsListComponent', () => {
  let component: ClientsListComponent;
  let fixture: ComponentFixture<ClientsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientsListComponent, ClientNamePipe ],
      providers: [
        {
          provide: ClientStateService,
          useValue: MockClientStateService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
