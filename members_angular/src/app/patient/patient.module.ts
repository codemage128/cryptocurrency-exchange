import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { ChartsModule as chartjsModule } from "ng2-charts";
import { NgxEchartsModule } from "ngx-echarts";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { NgApexchartsModule } from "ng-apexcharts";
import { MatDialogModule } from "@angular/material/dialog";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSortModule } from "@angular/material/sort";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatMenuModule } from "@angular/material/menu";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatRadioModule } from "@angular/material/radio";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { PatientRoutingModule } from "./patient-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PrescriptionsComponent } from "./prescriptions/prescriptions.component";
import { MedicalRecordsComponent } from "./medical-records/medical-records.component";
import { BillingComponent } from "./billing/billing.component";
import { SettingsComponent } from "./settings/settings.component";

@NgModule({
  declarations: [
    DashboardComponent,
    PrescriptionsComponent,
    MedicalRecordsComponent,
    BillingComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    chartjsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    PerfectScrollbarModule,
    MatIconModule,
    MatButtonModule,
    PatientRoutingModule,
    NgApexchartsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSortModule,
    MatToolbarModule,
    MatTabsModule,
    MatMenuModule,
    MatDatepickerModule,
    MatTableModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatInputModule,
    MatTooltipModule,
    MatSidenavModule,
    MatRadioModule,
    NgbModule,
  ],
})
export class PatientModule {}
