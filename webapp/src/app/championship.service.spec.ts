/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChampionshipService } from './championship.service';

describe('Service: Championship', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers : [ChampionshipService]
        });
    });

    it('should ...', inject([ChampionshipService], (service : ChampionshipService) => {
        expect(service).toBeTruthy();
    }));
});
