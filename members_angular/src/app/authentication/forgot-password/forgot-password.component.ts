import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import  *  as  Config  from  'config.json';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  baseApi: string = Config.api.baseApi;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
    });
  }
  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    const username = this.loginForm.get('username').value
    if (this.loginForm.invalid) {
      return;
    } else {
      this.http.post(this.baseApi + '/users/auth/forgot-password/' + username, {}).subscribe(
        (response: any) => {
          console.log('response: ', response)
          if(response == 'Email sent'){
            console.log("email has been sent")
            alert(response)
          }
        },
        (error: any) => {
          console.log(error.error['message']);
        }
      )
    }
  }
}
