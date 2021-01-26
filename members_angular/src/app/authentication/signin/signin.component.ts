import { AuthService } from './../../shared/security/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import *  as  Config from 'config.json';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  myRecaptcha = new FormControl(false);

  onScriptLoad() {
    console.log('Google reCAPTCHA loaded and is ready for use!');
  }

  onScriptError() {
    console.log('Something went long when loading the Google reCAPTCHA');
  }
  form: FormGroup;
  errorMsg: string = '';
  submitted = false;
  error = '';
  hide = true;
  baseApi: string = Config.api.baseApi;
  referralFullName: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }
  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.getReferralName();
    localStorage.removeItem('auth:token');
  }
  get formCtrl() {
    return this.form.controls;
  }
  async getReferralName() {
    const referralId = localStorage.getItem('ref:username');
    if (referralId) {
      const apiUrl = this.baseApi + '/users/getbyref/' + referralId;
      this.http.get(apiUrl).subscribe(
        (response: any) => {
          console.log(response.fullName);
          this.referralFullName = response.fullName;
        }, (error) => {
          console.log(error);
        }
      )
    }
  }
  async submitForm() {
    // if (this.form.valid && this.myRecaptcha.status == "VALID") {
    if (this.form.valid) {
      let reqData = {
        username: this.form.get('email').value,
        password: this.form.get('password').value
      }
      this.http.post(this.baseApi + '/users/authenticate', reqData).subscribe(
        async (response: any) => {
          console.log('response: ', response);
          const { token, username, tfa_allow, firstName, lastName, id, etfa_allow } = response;
          if (!token) return;
          localStorage.setItem('auth:token', token);
          localStorage.setItem('auth:uname', username);
          localStorage.setItem('auth:firstName', firstName);
          localStorage.setItem('auth:lastName', lastName);
          localStorage.setItem('auth:id', id);
          if (tfa_allow) {
            this.router.navigate(['/authentication/tfa-signin']);
          } else if (etfa_allow) {
            this.http.post(this.baseApi + '/users/send-code/' + username, {}).subscribe(
              (response: any) => {
                console.log('sending response', response);
                alert('we have sent code to your email, please verify it');
                this.router.navigate(['/authentication/email-verify']);
              },
              (error: any) => {
                console.log('sending error', error);
                this.router.navigate(['/authentication/email-verify']);
              }
            )
          }
          else {
            this.router.navigate(['/dashboard']);
            // username == 'admin123@admin.com' ? window.location.href = 'https://admin.share2riches.com' : this.router.navigate(['/dashboard']);
          }
        },
        (error: any) => {
          if (error.status == 400) {
            this.errorMsg = error.error['message'];
          } else {
            this.errorMsg = "Can't connect server.";
          }
        }
      )
    }
  }
}
