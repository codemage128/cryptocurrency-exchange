import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MustMatch } from '../mustMatch';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
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
  }

  submitForm() {
    document.querySelector('#validation').classList.remove("d-none")
    console.log("recaptcha", this.myRecaptcha.status)
    if (this.form.valid && this.myRecaptcha.status == "VALID") {
      
      let reqData = {
        firstName: this.form.get('firstName').value,
        lastName: this.form.get('lastName').value,
        username: this.form.get('email').value,
        password: this.form.get('password').value,
      }
      this.http.post('http://share2riches.com:4000/users/register', reqData).subscribe(
        (response: any) => {
          console.log(response);
          if (response.message === 'Registration successful') {
            alert("registered successfully")
            this.router.navigate(['signin']);
          }
        },
        (error : any) => {
          console.log(error)
          this.errorMsg = error.error['message']
        }
      )
    }
  }
}
