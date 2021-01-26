import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppsRoutingModule } from "./apps-routing.module";
import { MatExpansionModule } from "@angular/material/expansion";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTabsModule } from "@angular/material/tabs";
import { AffiliateLinksComponent } from './affiliate-links/affiliate-links.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { StatsComponent } from './stats/stats.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { DownlineState } from "./downline-state/downline-state.component";
import { BuyPositionComponent } from "./buy-position/buy-position.component";
import { TransactionHistoryComponent } from "./transaction-history/transaction-history.component";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { DragulaModule } from "ng2-dragula";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatMenuModule } from "@angular/material/menu";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TfaModalComponent } from './tfa-modal/tfa.component';
import { StaffProfileComponent } from './staff-profile/staff-profile.component';

@NgModule({
  declarations: [
    DownlineState,
    AffiliateLinksComponent,
    AccountProfileComponent,
    StatsComponent,
    WithdrawalComponent,
    BuyPositionComponent,
    TransactionHistoryComponent,
    TfaModalComponent,
    StaffProfileComponent,
  ],
  imports: [
    CommonModule,
    AppsRoutingModule,
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
    NgxDatatableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatMenuModule,
    NgbModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MatDatepickerModule,
    MaterialFileInputModule,
    MatSlideToggleModule,
    DragulaModule.forRoot(),
  ],
})
export class AppsModule { }
