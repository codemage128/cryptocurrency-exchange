// import { AuthGuard } from './shared/security/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Role } from './shared/security/role';
import { AuthGuard } from './core/guards';
import { RefComponent } from './ref/ref.component';
const routes: Routes = [

  {
    path: 'members',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'member',
    canActivate: [AuthGuard],
    data: {
      role: Role.Doctor,
    },
    loadChildren: () =>
      import('./doctor/doctor.module').then((m) => m.DoctorModule),
  },
  {
    path: 'patient',
    canActivate: [AuthGuard],
    data: {
      role: Role.Patient,
    },
    loadChildren: () =>
      import('./patient/patient.module').then((m) => m.PatientModule),
  },
  {
    path: 'email',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./email/email.module').then((m) => m.EmailModule),
  },
  {
    path: 'calendar',
    canActivate: [AuthGuard],
    loadChildren: () => import('./apps/apps.module').then((m) => m.AppsModule),
  },
  // {
  //   path: 'affilicate-link',
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('./apps/affiliate-links/affiliate-links.component').then((m) => m.AffiliateLinksComponent),
  // },
  // {
  //   path: 'account-profile',
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('./apps/apps.module').then((m) => m.AppsModule),
  // },
  // {
  //   path: 'stats',
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('./apps/apps.module').then((m) => m.AppsModule),
  // },
  // {
  //   path: 'withdrawal',
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('./apps/apps.module').then((m) => m.AppsModule),
  // },
  // {
  //   path: 'downline-state',
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('./apps/apps.module').then((m) => m.AppsModule),
  // },
  // {
  //   path: '',
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('./apps/apps.module').then((m) => m.AppsModule),
  // },
  // {
  //   path: '',
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('./landing/landing.module').then((m) => m.LandingModule),
  // },
  // {
  //   path: '',
  //   loadChildren: () => import('./landing/landing.module').then((m) => m.LandingModule),
  // },
  
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./apps/apps.module').then((m) => m.AppsModule),
  },
  {
    path: 'widget',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./widget/widget.module').then((m) => m.WidgetModule),
  },
  {
    path: 'position',
    canActivate: [AuthGuard],
    loadChildren: () => import('./ui/ui.module').then((m) => m.UiModule),
  },
  {
    path: 'forms',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./forms/forms.module').then((m) => m.FormModule),
  },
  {
    path: 'tables',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./tables/tables.module').then((m) => m.TablesModule),
  },
  {
    path: 'media',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./media/media.module').then((m) => m.MediaModule),
  },
  {
    path: 'charts',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./charts/charts.module').then((m) => m.ChartsModule),
  },
  {
    path: 'timeline',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./timeline/timeline.module').then((m) => m.TimelineModule),
  },
  {
    path: 'icons',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./icons/icons.module').then((m) => m.IconsModule),
  },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: 'extra-pages',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./extra-pages/extra-pages.module').then(
        (m) => m.ExtraPagesModule
      ),
  },
  {
    path: 'maps',
    canActivate: [AuthGuard],
    loadChildren: () => import('./maps/maps.module').then((m) => m.MapsModule),
  },
  {
    path: 'multilevel',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./multilevel/multilevel.module').then((m) => m.MultilevelModule),
  },
  {
    path: 'landing',
    canActivate: [AuthGuard],
    loadChildren: () => import('./landing/landing.module').then((m) => m.LandingModule),
    data: { isLanding: true }
  },
  {
    path: '**',
    redirectTo: '/landing',
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
