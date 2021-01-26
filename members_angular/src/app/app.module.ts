import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RightSidebarComponent } from './layout/right-sidebar/right-sidebar.component';
import { DynamicScriptLoaderService } from './shared/services/dynamic-script-loader.service';
import { ConfigService } from './shared/services/config.service';
import { AppointmentService } from './admin/appointment/viewappointment/appointment.service';
import { AppointmentsService } from './doctor/appointments/appointments.service';
import { UpcomingAppointmentService } from './patient/appointments/upcoming-appointment/upcoming-appointment.service';
import { PastAppointmentService } from './patient/appointments/past-appointment/past-appointment.service';
import { StaffService } from './admin/staff/allstaff/staff.service';
import { PatientService } from './admin/patients/allpatients/patient.service';
import { RoomService } from './admin/room/allroom/room.service';
import { PaymentService } from './admin/payment/allpayment/payment.service';
import { RightSidebarService } from './shared/services/rightsidebar.service';
import { AuthGuard } from './shared/security/auth.guard';
import { AuthService } from './shared/security/auth.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from 'ngx-perfect-scrollbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaskModule } from 'ngx-mask';
import { MatListModule } from '@angular/material/list';
import { SimpleDialogComponent } from './ui/modal/simpleDialog.component';
import { DialogformComponent } from './ui/modal/dialogform/dialogform.component';
import { BottomSheetOverviewExampleSheet } from './ui/bottom-sheet/bottom-sheet.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { ClickOutsideModule } from 'ng-click-outside';
import { RecaptchaModule } from 'angular-google-recaptcha';
import { PaymentNotificationComponent } from './layout/payment-notification/payment-notification.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RefComponent } from './ref/ref.component';
import { LandingFooterComponent } from './landing/footer/footer.component';
import { LandingHeaderComponent } from './landing/header/header.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false,
};
@NgModule({
  declarations: [
    AppComponent,
    LandingHeaderComponent,
    LandingFooterComponent,
    HeaderComponent,
    PageLoaderComponent,
    SidebarComponent,
    RightSidebarComponent,
    SimpleDialogComponent,
    DialogformComponent,
    BottomSheetOverviewExampleSheet,
    PaymentNotificationComponent,
    RefComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    MatIconModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonToggleModule,
    NgxSpinnerModule,
    ClickOutsideModule,
    MatSnackBarModule,
    RecaptchaModule.forRoot({
      siteKey: '6Le5YNIZAAAAAENTEtBCW06kaQpyYm0Y639yoPBl',
    }),
    NgxMaskModule.forRoot(),
  ],
  providers: [
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    DynamicScriptLoaderService,
    ConfigService,
    RightSidebarService,
    AppointmentService,
    StaffService,
    PatientService,
    RoomService,
    PaymentService,
    AppointmentsService,
    UpcomingAppointmentService,
    PastAppointmentService,
    AuthService,
    AuthGuard,
  ],
  entryComponents: [
    SimpleDialogComponent,
    DialogformComponent,
    BottomSheetOverviewExampleSheet,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
