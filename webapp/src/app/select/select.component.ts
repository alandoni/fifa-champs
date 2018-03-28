import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {

    @Input() ids : Array<string>;
    @Input() name : string;
    @Input() label : string;
    @Input() names : Array<string>;
    @Output() onChange : EventEmitter<string>;

    innerValue : string;

    @Input() get selected() {
        return this.innerValue;
    }

    set selected(value) {
        this.innerValue = value;
        this.onChange.emit(value);
    }

    change(value) {
        this.selected = value;
    }

    constructor() {
        this.onChange = new EventEmitter();
    }

    ngOnInit() {
        if (!this.selected) {
            this.selected = this.ids[0];
        }
    }

}
