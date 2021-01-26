import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from 'src/app/authentication/login-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StickyDirection } from '@angular/cdk/table';
import { StaffProfileComponent } from '../staff-profile/staff-profile.component'
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/security/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './tfa.component.html',
  styleUrls: ['./tfa.component.scss']
})
export class TfaModalComponent implements OnInit {
  error = '';
  tfa: any = {};
  authcode: string = "";
  errorMessage: string = null;
  username: string = '';
  tempSecret: string = '';
  uname: string = '';
  constructor(
    private _loginService: LoginServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private stafComponent: StaffProfileComponent,
  ) {
    this.getAuthDetails();
  }

  ngOnInit() {
  }

  async getAuthDetails() {
    this.uname = await localStorage.getItem('auth:uname');
    this._loginService.getAuth(this.uname).subscribe((data) => {
      const result = data.body
      if (data['status'] === 200) {
        console.log("result", result);
        if (result == null) {
          console.log("here result null")
          this.setup();
        } else {
          this.tfa = result;
        }
      }
    });
  }

  async setup() {
    this.uname = await localStorage.getItem('auth:uname');
    this._loginService.setupAuth(this.uname).subscribe((data) => {
      const result = data.body
      if (data['status'] === 200) {
        console.log(result);
        this.tfa = result;
        console.log("tfa", this.tfa)
        this.tempSecret = this.tfa.tempSecret
      }
    });
  }

  confirm() {
    this._loginService.verifyAuth(this.authcode).subscribe((data) => {
      const result = data.body
      if (result['status'] === 200) {
        console.log(result);
        this.errorMessage = null;
        this.tfa.secret = this.tfa.tempSecret;
        this.tfa.tempSecret = "";

        // const formBuilder = this.formBuilder;
        // const router = this.router;
        // const http = this.http;
        // const authService = this.authService;
        // const dialog = this.dialog;
        // const snackBar = this.snackBar;
        // let staffcomponent = new StaffProfileComponent(formBuilder, router, http, authService, dialog, snackBar);
        // staffcomponent.tfa_allow();

        this.stafComponent.tfa_allow(true);
      } else {
        this.errorMessage = result['message'];
        this.stafComponent.getUserInfo();
      }
    });
  }

  disabledTfa() {
    this._loginService.deleteAuth().subscribe((data) => {
      const result = data.body
      if (data['status'] === 200) {
        console.log(result);
        this.authcode = "";
        this.getAuthDetails();
      }
    });
  }
}
