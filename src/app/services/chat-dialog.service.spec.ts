import { TestBed } from '@angular/core/testing';

import { ChatDialogService } from './chat-dialog.service';

describe('ChatDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatDialogService = TestBed.get(ChatDialogService);
    expect(service).toBeTruthy();
  });
});
