import { TestBed, inject } from '@angular/core/testing';

import { TeamPickService } from './team-pick.service';

describe('TeamPickService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TeamPickService]
        });
    });

    it('should be created', inject([TeamPickService], (service : TeamPickService) => {
        expect(service).toBeTruthy();
    }));
});
