import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import { MatRadioModule } from "@angular/material/radio";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { AppointmentRoutingModule } from "./appointment-routing.module";
import { BookappointmentComponent } from "./bookappointment/bookappointment.component";
import { EditappointmentComponent } from "./editappointment/editappointment.component";
import { ViewappointmentComponent } from "./viewappointment/viewappointment.component";
import { DeleteDialogComponent } from "./viewappointment/dialogs/delete/delete.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSortModule } from "@angular/material/sort";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatToolbarModule } from "@angular/material/toolbar";
import { FormDialogComponent } from "./viewappointment/dialogs/form-dialog/form-dialog.component";
import { MaterialFileInputModule } from "ngx-material-file-input";
@NgModule({
  declarations: [
    BookappointmentComponent,
    EditappointmentComponent,
    ViewappointmentComponent,
    DeleteDialogComponent,
    FormDialogComponent,
  ],
  imports: [
    CommonModule,
    AppointmentRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MatCardModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MaterialFileInputModule,
    MatDatepickerModule,
  ],
})
export class AppointmentModule {}
