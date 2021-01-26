import { Component, OnInit } from '@angular/core';
declare let $: any;

@Component({
  selector: 'app-funfact',
  templateUrl: './funfact.component.html',
  styleUrls: ['./funfact.component.scss']
})
export class FunfactComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // Count Down with Odometer JS
    $('.odometer').appear(() => {
        const odo = $('.odometer');
        odo.each(function() {
            const countNumber = $(this).attr('data-count');
            $(this).html(countNumber);
        });
    });
  }

}
