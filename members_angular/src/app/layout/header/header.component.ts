import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  AfterViewInit,
  Input,
} from '@angular/core';
import { RightSidebarService } from '../../shared/services/rightsidebar.service';
import { ConfigService } from '../../shared/services/config.service';
import { AuthService } from 'src/app/shared/security/auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import *  as  Config from 'config.json';
import { HttpClient } from '@angular/common/http';

const document: any = window.document;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Input() userImage: Subject<string> = new Subject<string>();
  public config: any = {};
  userImg: string;
  homePage: string;
  isNavbarCollapsed = true;
  user_id: number = 0;
  positionInfo: any;
  baseApi: string = Config.api.baseApi;
  notificationStatus: boolean = true;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private dataService: RightSidebarService,
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }
  ngOnInit() {
    this.config = this.configService.configData;
    this.userImg = 'assets/images/user/user7.jpg';
    this.userImage.subscribe(result => {
      // console.log(result);
      this.userImg = result;
    })
    // this.homePage = 'member/dashboard';
    // setInterval(() => {
    //   this.getPaymentStatus();
    // }, 5000);
    // this.getPaymentStatus();
    // setTimeout(() => {
    //   this.getPaymentStatus();
    // }, 5000);
    // this.getUserInfo();
  }

  ngAfterViewInit() {
    this.getPaymentStatus();
    // set theme on startup
    if (localStorage.getItem('theme')) {
      this.renderer.removeClass(this.document.body, this.config.layout.variant);
      this.renderer.addClass(this.document.body, localStorage.getItem('theme'));
    } else {
      this.renderer.addClass(this.document.body, this.config.layout.variant);
    }
    if (localStorage.getItem('menuOption')) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('menuOption')
      );
    } else {
      this.renderer.addClass(
        this.document.body,
        'menu_' + this.config.layout.sidebar.backgroundColor
      );
    }
    if (localStorage.getItem('choose_logoheader')) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('choose_logoheader')
      );
    } else {
      this.renderer.addClass(
        this.document.body,
        'logo-' + this.config.layout.logo_bg_color
      );
    }

    if (localStorage.getItem('sidebar_status')) {
      if (localStorage.getItem('sidebar_status') === 'close') {
        this.renderer.addClass(this.document.body, 'side-closed');
        this.renderer.addClass(this.document.body, 'submenu-closed');
      } else {
        this.renderer.removeClass(this.document.body, 'side-closed');
        this.renderer.removeClass(this.document.body, 'submenu-closed');
      }
    } else {
      if (this.config.layout.sidebar.collapsed === true) {
        this.renderer.addClass(this.document.body, 'side-closed');
        this.renderer.addClass(this.document.body, 'submenu-closed');
      }
    }
  }
  callFullscreen() {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }
  mobileMenuSidebarOpen(event: any, className: string) {
    const hasClass = event.target.classList.contains(className);
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
  public toggleRightSidebar(): void {
    this.dataService.changeMsg(
      (this.dataService.currentStatus._isScalar = !this.dataService
        .currentStatus._isScalar)
    );
  }
  logout() {
    this.authService.logout().subscribe((res) => {
      if (!res.success) {
        localStorage.removeItem('auth:token');
        this.router.navigate(['/authentication/signin']);
      }
    });
  }

  async getPaymentStatus() {
    const apiUrl = this.baseApi + '/coins/paymentstatus';
    const token = localStorage.getItem('auth:token');
    const headers = { 'Authorization': 'Bearer ' + token }
    await this.http.post<any>(apiUrl, { headers }).subscribe(
      (response: any) => {
        // console.log('response', response);
        this.positionInfo = response;
        if (response.length == 0) {
          this.notificationStatus = false;
          // console.log(this.notificationStatus);
          return;
        }
        this.notificationStatus = true;
        for (var i = 0; i < response.length; i++) {
          if (response[i].confirmation_number == 3 || response[i].confirmation_number == 5 || response[i].confirmation_number == 10) {
            this.showNotification_success(
              'snackbar-success',
              'Successfully payment for ' + response[i].coin_address,
              'bottom',
              'center'
            );
          }
        }
      },
      (error: any) => {
        // console.log(error);
      })
  }

  showNotification_success(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 15000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  async getUserInfo() {
    let token = localStorage.getItem('auth:token');
    if (!token) return;
    const apiUrl = this.baseApi + '/users/current';
    const headers = { 'Authorization': 'Bearer ' + token }
    await this.http.get<any>(apiUrl, { headers }).subscribe(
      (response: any) => {
        this.user_id = response.id;
      },
      (error: any) => {
        console.log(error);
      })
  }
}
