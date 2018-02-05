import { Component, OnInit, Input } from '@angular/core';
import { NavigationBarItem } from './../models/navigation-bar-item.model';

@Component({
    selector: 'app-navigation-bar-item',
    templateUrl: './navigation-bar-item.component.html',
    styleUrls: ['./navigation-bar-item.component.css']
})
export class NavigationBarItemComponent implements OnInit {

    @Input() item : NavigationBarItem;

    constructor() { }

    ngOnInit() {
    }

}
