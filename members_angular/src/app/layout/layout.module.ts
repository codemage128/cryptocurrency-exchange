import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatTabsModule } from "@angular/material/tabs";
import { PaymentNotificationComponent } from './payment-notification/payment-notification.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@NgModule({
  imports: [CommonModule, NgbModule, MatTabsModule, MatSnackBarModule,],
  declarations: [PaymentNotificationComponent],
})
export class LayoutModule {}
