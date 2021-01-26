import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './demos/default/default.component';
import { DemoTwoComponent } from './demos/demo-two/demo-two.component';
import { DemoThreeComponent } from './demos/demo-three/demo-three.component';
import { AboutComponent } from './pages/about/about.component';
import { FeaturesComponent } from './pages/features/features.component';
import { TeamComponent } from './pages/team/team.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { FaqComponent } from './pages/faq/faq.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SigninComponent } from './pages/signin/signin.component';
import { ContactComponent } from './pages/contact/contact.component';
import { RefComponent } from './ref/ref.component';

const routes: Routes = [
  { path: '', component: DemoThreeComponent },
  { path: 'demo-2', component: DemoTwoComponent },
  { path: 'demo-3', component: DefaultComponent },
  { path: 'about-us', component: AboutComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'team', component: TeamComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-details', component: BlogDetailsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'ref/:username', component: RefComponent },
  { path: '**', component: NotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
