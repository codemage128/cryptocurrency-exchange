import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DownlineState } from './downline-state/downline-state.component';
import { AffiliateLinksComponent } from './affiliate-links/affiliate-links.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { StatsComponent } from './stats/stats.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { BuyPositionComponent } from "./buy-position/buy-position.component";
import { TransactionHistoryComponent } from "./transaction-history/transaction-history.component";
import { StaffProfileComponent } from "./staff-profile/staff-profile.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: 'stats',
    pathMatch: 'full'
  },
  {
    path: 'affilicate-link',
    component: AffiliateLinksComponent
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
    path: 'buy-position',
    component: BuyPositionComponent
  },
  {
    path: 'transaction-history',
    component: TransactionHistoryComponent
  },
  {
    path: 'downline-state',
    component: DownlineState
  },
  {
    path: 'profile',
    component: StaffProfileComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppsRoutingModule { }
