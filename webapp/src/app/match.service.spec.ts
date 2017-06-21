/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MatchService } from './match.service';

describe('Service: Match', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatchService]
    });
  });

  it('should ...', inject([MatchService], (service: MatchService) => {
    expect(service).toBeTruthy();
  }));
});
