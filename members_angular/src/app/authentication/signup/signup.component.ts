import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MustMatch } from 'src/app/authentication/mustMatch';
import { FormControl } from '@angular/forms';
import *  as  Config from 'config.json';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  myRecaptcha = new FormControl(false);
  onScriptLoad() {
    console.log('Google reCAPTCHA loaded and is ready for use!');
  }

  onScriptError() {
    console.log('Something went long when loading the Google reCAPTCHA');
  }
  form: FormGroup;
  chide = true;
  hide = true;
  errorMsg: string = '';
  baseApi: string = Config.api.baseApi;
  referralFullName: string = '';

  constructor(private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    })
  }

  get formCtrl() {
    return this.form.controls;
  }

  ngOnInit() {
    console.log(localStorage.getItem('ref:username'));
    this.getReferralName();
  }

  async getReferralName() {
    const referralId = localStorage.getItem('ref:username');
    if (referralId) {
      const apiUrl = this.baseApi + '/users/getbyref/' + referralId;
      this.http.get(apiUrl).subscribe(
        (response: any) => {
          this.referralFullName = response.fullName;
        }, (error) => {
          console.log(error);
        }
      )
    }
  }

  submitForm() {
    console.log("recaptcha", this.myRecaptcha.status);
    // if (this.form.valid && this.myRecaptcha.status == "VALID") {
    if (this.form.valid) {
      let reqData = {
        firstName: this.form.get('firstName').value,
        lastName: this.form.get('lastName').value,
        username: this.form.get('email').value,
        password: this.form.get('password').value,
      };
      this.http.post(this.baseApi + '/users/register', reqData).subscribe(
        (response: any) => {
          console.log(response);
          if (response.message === 'Registration successful') {
            if (localStorage.getItem('ref:username')) {
              const refUsername = localStorage.getItem('ref:username');

              const apiUrl = this.baseApi + '/users/set-referrer';
              var username = reqData.username;
              this.http.post(apiUrl, { username, refUsername }).subscribe(
                (response: any) => {
                  console.log(response);
                }, (err: any) => {
                  console.log(err);
                }
              )
            }
            this.snackBar.open('succesfully registered!', '', {
              duration: 2000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              panelClass: 'snackbar-success'
            });
            if (localStorage.getItem('ref:username')) {
              localStorage.removeItem('ref:username');
            }
            this.router.navigate(['authentication/signin']);
          };
        },
        (error: any) => {
          console.log(error);
          this.errorMsg = error.error['message']
        }
      );
    }
  }
}
