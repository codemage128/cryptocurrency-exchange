import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import  *  as  Config  from  'config.json';

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.sass']
})
export class EmailVerifyComponent implements OnInit {
  loginform: FormGroup;
  errorMsg: string = '';
  baseApi: string = Config.api.baseApi;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.loginform = this.formBuilder.group({
      verifycode: ['', Validators.required],
    })
  }

  onSubmit() {
    const verifycode = this.loginform.get('verifycode').value;
    if (this.loginform.invalid)
      return;
    const reqdata = {
      username: localStorage.getItem('auth:uname'),
      verifycode: verifycode,
    }
    const apiUrl = this.baseApi + '/users/verify-code/';
    this.http.post(apiUrl, reqdata).subscribe(
      (response: any) => {
        console.log('response', response);
        this.router.navigate(['/member/dashboard']);
      },
      (error: any) => {
        console.log('error', error.error)
        if(error.error['text'] == 'success'){
          this.router.navigate(['/member/dashboard']);
        } else{
          this.errorMsg = error.error;
          console.log('error', this.errorMsg);
        }
      }
    )
  }
}
