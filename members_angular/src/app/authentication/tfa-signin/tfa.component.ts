import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from 'src/app/authentication/login-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './tfa.component.html',
  styleUrls: ['./tfa.component.scss']
})
export class TfaSigninComponent implements OnInit {
  error = '';
  tfa: any = {};
  authcode: string = "";
  errorMessage: string = null;
  username: string = '';
  tempSecret: string = '';
  uname: string = '';
  constructor(
    private _loginService: LoginServiceService,
  ) {
    this.getAuthDetails();
  }

  ngOnInit() { }

  async getAuthDetails() {
    this.uname = await localStorage.getItem('auth:uname');
    this._loginService.getAuth(this.uname).subscribe((data) => {
      const result = data.body
      if (data['status'] === 200) {
        console.log("result", result);
        if (result == null) {
          console.log("here result null");
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
        console.log("tfa", this.tfa);
        this.tempSecret = this.tfa.tempSecret;
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
      } else {
        this.errorMessage = result['message'];
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
