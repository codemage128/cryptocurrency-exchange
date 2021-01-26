import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import  *  as  Config  from  'config.json';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  id: string = '';
  token: string = '';
  chide = true;
  errorMsg: string = '';
  hide = true;
  baseApi: string = Config.api.baseApi;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }
 
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      password: ['', Validators.required],
      cpassword: ['', Validators.required],
    },
    // {validator: MustMatch('password', 'cPassword')}
    );
    this.route.paramMap.subscribe(params => {
      console.log("id", Object.values(params)[0].id);
      this.id = Object.values(params)[0].id;
      this.token = Object.values(params)[0].token;
      console.log("token", typeof (params));
    });
  }
  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    const apiUrl = this.baseApi + '/users/auth/reset-password/' + this.id + '/' + this.token
    // stop here if form is invalid 
    if (this.loginForm.invalid) {   
      return;
    } else {
      if (this.loginForm.valid) {
        let reqData = {
          password: this.loginForm.get("password").value,
        }
        this.http.post(apiUrl, reqData).subscribe(
          (response: any) => {
            console.log('response: ', response);
            this.router.navigate(['/authentication/signin']);
          },
          (error: any) => {
            console.log("error", error.error['message']);
            this.errorMsg = error.error['message'];
          }
        )
      }
      this.router.navigate(['/dashboard/main']);
    }
  }
}
