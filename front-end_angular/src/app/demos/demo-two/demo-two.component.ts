import { Component, OnInit } from '@angular/core';
declare let $: any;

@Component({
  selector: 'app-demo-two',
  templateUrl: './demo-two.component.html',
  styleUrls: ['./demo-two.component.scss']
})
export class DemoTwoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('select').niceSelect();
  }

}
