import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPickComponent } from './team-pick.component';

describe('TeamPickComponent', () => {
    let component : TeamPickComponent;
    let fixture : ComponentFixture<TeamPickComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ TeamPickComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TeamPickComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
