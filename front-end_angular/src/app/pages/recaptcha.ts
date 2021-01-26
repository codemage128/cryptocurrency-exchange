import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule } from 'angular-google-recaptcha';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
 
@Component({
    selector: 'app',
    template: `
        <recaptcha
          [formControl]="myRecaptcha"
          (scriptLoad)="onScriptLoad()"
          (scriptError)="onScriptError()"
        ></recaptcha>
    `
})
export class AppComponent {
    myRecaptcha = new FormControl(false);
 
    onScriptLoad() {
        console.log('Google reCAPTCHA loaded and is ready for use!')
    }
 
    onScriptError() {
        console.log('Something went long when loading the Google reCAPTCHA')
    }
}
@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        RecaptchaModule.forRoot({
            siteKey: 'YOUR_SITE_KEY_HERE',
        }),
    ],
})
export class AppModule { }