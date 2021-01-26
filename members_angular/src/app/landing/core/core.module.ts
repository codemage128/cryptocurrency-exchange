import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiService } from './services';
import { RoleGuard, AuthGuard } from './guards';
import { HttpTokenInterceptor } from './interceptors';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [ApiService, AuthGuard, RoleGuard, {provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true}]
})
export class CoreModule { }
