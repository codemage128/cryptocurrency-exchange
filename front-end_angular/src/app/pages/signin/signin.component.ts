import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  myRecaptcha = new FormControl(false);
 
  onScriptLoad() {
      console.log('Google reCAPTCHA loaded and is ready for use!')
  }

  onScriptError() {
      console.log('Something went long when loading the Google reCAPTCHA')
  }
  form: FormGroup;
  errorMsg: string = '';

  constructor(private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  get formCtrl() {
    return this.form.controls;
  }

  submitForm() {
    if (this.form.valid && this.myRecaptcha.status == "VALID") {
      console.log("recaptcha", this.myRecaptcha)
      let reqData = {
        username: this.form.get('email').value,
        password: this.form.get('password').value
      }
      this.http.post('http://share2riches.com:4000/users/authenticate', reqData).subscribe(
        (response: any) => {
          console.log('response: ', response)

          const {token, username} = response
          if (!token) return;
          localStorage.setItem('auth:token', token);
          username == 'admin123@admin.com' ? window.location.href = '/admin' : window.location.href = 'http://app.share2riches.com:4000';
        },
        (error: any) => {
          console.log(error.error['message']);
          this.errorMsg = error.error['message'];
        }
      )
    }
  }

  ngOnInit() {
  }

}
