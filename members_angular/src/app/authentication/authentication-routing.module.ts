import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LockedComponent } from './locked/locked.component';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';
import { ResetPasswordComponent } from './reset-passsword/reset-password.component'
import { TfaSigninComponent } from './tfa-signin/tfa.component';
import { EmailVerifyComponent } from './email-verify/email-verify.component';
import { RefComponent } from './ref/ref.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full'
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'ref/:username',
    component: RefComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'email-verify',
    component: EmailVerifyComponent
  },
  {
    path: 'tfa-signin',
    component: TfaSigninComponent
  },
  {
    path: 'reset-password/:id/:token',
    component: ResetPasswordComponent
  },
  {
    path: 'locked',
    component: LockedComponent
  },
  {
    path: 'page404',
    component: Page404Component
  },
  {
    path: 'page500',
    component: Page500Component
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
