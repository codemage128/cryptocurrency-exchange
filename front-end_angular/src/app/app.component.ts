import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FormControl } from '@angular/forms';
declare let $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [
        Location, {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }
    ]
})
export class AppComponent {
  
    location: any;

    constructor(
        private router: Router,
        location: Location
        ){
        this.router.events.subscribe((ev) => {
          console.log(ev);
          if (ev instanceof NavigationStart) {
            $('.preloader').fadeIn();
          }
          if (ev instanceof NavigationEnd) {
            this.location = location.path();
            $('.preloader').fadeOut('slow');
          }
        });
        $('.preloader').fadeOut('slow');
    }
}
