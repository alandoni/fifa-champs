/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlayerServiceService } from './player-service.service';

describe('Service: PlayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayerServiceService]
    });
  });

  it('should ...', inject([PlayerServiceService], (service: PlayerServiceService) => {
    expect(service).toBeTruthy();
  }));
});
