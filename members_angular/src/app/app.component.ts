import { Component } from '@angular/core';
import {
  Event,
  Router,
  NavigationStart,
  NavigationEnd,
  ActivatedRoute,
} from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { PlatformLocation, Location } from '@angular/common';
import { Subject } from 'rxjs';
declare let $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  location: any;
  currentUrl: string;
  isOpen: Boolean = false;
  userImage: Subject<string> = new Subject<string>();
  constructor(public activatedRoute: ActivatedRoute, public _router: Router, location: PlatformLocation, Location: Location, private spinner: NgxSpinnerService) {
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        // this.spinner.show();
        // location.onPopState(() => {
        //   window.location.reload();
        // });
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1
        );
        console.log(this.currentUrl);
        if (this.currentUrl == " ") {
          this.isOpen = true;
        }
      }
      // this.userImage.next('assets/images/user/user7.jpg');
      if (routerEvent instanceof NavigationEnd) {
        // this.spinner.hide();
        // this.currentUrl = routerEvent.url;
      }
      window.scrollTo(0, 0);
    });

    // setTimeout(() => {
    //   this.userImage.next('assets/images/user/user6.jpg');
    // }, 5000);

    this._router.events.subscribe((ev) => {
      if (ev instanceof NavigationStart) {
        $('.preloader').fadeIn();
      }
      if (ev instanceof NavigationEnd) {
        this.location = Location.path();
        $('.preloader').fadeOut("slow");
      }
    });
    $('.preloader').fadeOut('slow');
  }

}
