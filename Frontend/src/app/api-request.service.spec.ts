/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ApiRequestService } from './api-request.service';

describe('Service: ApiRequest', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiRequestService]
    });
  });

  it('should ...', inject([ApiRequestService], (service: ApiRequestService) => {
    expect(service).toBeTruthy();
  }));
});
