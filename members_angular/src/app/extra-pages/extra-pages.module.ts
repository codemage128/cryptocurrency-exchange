import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExtraPagesRoutingModule } from "./extra-pages-routing.module";
import { ProfileComponent } from "./profile/profile.component";
import { PricingComponent } from "./pricing/pricing.component";
import { InvoiceComponent } from "./invoice/invoice.component";
import { DownlineState } from "./downline-state/downline-state.component";
import { BlankComponent } from "./blank/blank.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTabsModule } from "@angular/material/tabs";
import { AffiliateLinksComponent } from './affiliate-links/affiliate-links.component';
import { AccountHistoryComponent } from './account-history/account-history.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { StatsComponent } from './stats/stats.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";

@NgModule({
  declarations: [
    ProfileComponent,
    PricingComponent,
    InvoiceComponent,
    DownlineState,
    BlankComponent,
    AffiliateLinksComponent,
    AccountHistoryComponent,
    AccountProfileComponent,
    StatsComponent,
    WithdrawalComponent,
  ],
  imports: [
    CommonModule,
    ExtraPagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSelectModule,
    MatTableModule,
  ],
})
export class ExtraPagesModule { }
