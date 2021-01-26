import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

@Component({
    selector: 'app-landing-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],

    providers: [
        Location, {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }
    ]
})
export class LandingHeaderComponent implements OnInit {
    location: any;
    layoutClass: string;
    username: string = '';
    path: string = '';
    constructor(
        private router: Router,
        location: Location,
    ) {
        this.router.events.subscribe((ev) => {
            if (ev instanceof NavigationEnd) {
                this.location = location.path();
                if (this.location == '/demo-3') {
                    this.layoutClass = 'navbar-style-two';
                } else {
                    this.layoutClass = '';
                }
            }
        });
    }

    ngOnInit() {
        // console.log('referral username : ', localStorage.getItem('ref:username'));
    }

    ngAfterViewInit() {
        // console.log('ref username', localStorage.getItem('ref:username'));
        // console.log('location', location.pathname);
        this.path = location.pathname;
    }

    login() {
        this.username = localStorage.getItem('ref:username');
        if (this.username != null){}
            // window.location.href = 'http://app.share2riches.com/#/authentication/ref/' + this.username;
            this.router.navigate(['/authentication']);
            // window.location.href = 'http://localhost:4202/#/authentication/ref/' + this.username;

        // window.location.href = 'http://app.share2riches.com/#/authentication/signin';
    }

}
