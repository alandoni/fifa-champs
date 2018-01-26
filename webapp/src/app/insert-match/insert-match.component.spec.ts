/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InsertMatchComponent } from './insert-match.component';

describe('InsertMatchComponent', () => {
    let component : InsertMatchComponent;
    let fixture : ComponentFixture<InsertMatchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ InsertMatchComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InsertMatchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
