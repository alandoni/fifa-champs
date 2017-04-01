import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {

  ids = ['1', '2', '3', '4'];
  names = ['alan', 'chris', 'junim', 'rborcat'];

  selected : string = '3';

  constructor() { }

  ngOnInit() {
  }

  change(event) {
    this.selected = event;
  }

}
