import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Appointments } from './appointments.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable()
export class AppointmentsService {
  private readonly API_URL = 'assets/data/doc-appointments.json';
  dataChange: BehaviorSubject<Appointments[]> = new BehaviorSubject<
    Appointments[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {}
  get data(): Appointments[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllAppointmentss(): void {
    this.httpClient.get<Appointments[]>(this.API_URL).subscribe(
      (data) => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }
  // DEMO ONLY, you can find working methods below
  addAppointments(appointments: Appointments): void {
    this.dialogData = appointments;
  }
  updateAppointments(appointments: Appointments): void {
    this.dialogData = appointments;
  }
  deleteAppointments(id: number): void {
    console.log(id);
  }
}
