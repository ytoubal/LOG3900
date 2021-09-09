/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LobbyService } from './lobby.service';

describe('Service: Lobby', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LobbyService]
    });
  });

  it('should ...', inject([LobbyService], (service: LobbyService) => {
    expect(service).toBeTruthy();
  }));
});
