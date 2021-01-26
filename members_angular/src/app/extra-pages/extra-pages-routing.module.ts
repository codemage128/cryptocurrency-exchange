import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { PricingComponent } from './pricing/pricing.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { DownlineState } from './downline-state/downline-state.component';
import { BlankComponent } from './blank/blank.component';
import { AffiliateLinksComponent } from './affiliate-links/affiliate-links.component';
import { AccountHistoryComponent } from './account-history/account-history.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { StatsComponent } from './stats/stats.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';

const routes: Routes = [
  {
    path: 'affilicate-link',
    component: AffiliateLinksComponent
  },
  {
    path: 'account-history',
    component: AccountHistoryComponent
  },
  {
    path: 'account-profile',
    component: AccountProfileComponent
  },
  {
    path: 'stats',
    component: StatsComponent
  },
  {
    path: 'withdrawal',
    component: WithdrawalComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'pricing',
    component: PricingComponent
  },
  {
    path: 'invoice',
    component: InvoiceComponent
  },
  {
    path: 'downline-state',
    component: DownlineState
  },
  {
    path: 'blank',
    component: BlankComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtraPagesRoutingModule { }
