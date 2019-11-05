import { TestBed } from '@angular/core/testing';

import { WebsocketService } from './websocket.service';
import {MessagesService} from '../../core';
import {WebSocketConfig} from '..';

export class MockMessagesService {
  success(msg: string): void {
  }
}

describe('WebsocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: MessagesService,
        useValue: MockMessagesService
      },
      {
        provide: WebSocketConfig,
        useValue: {url: ''}
      }
    ]
  }));

  it('should be created', () => {
    const service: WebsocketService = TestBed.get(WebsocketService);
    expect(service).toBeTruthy();
  });
});
