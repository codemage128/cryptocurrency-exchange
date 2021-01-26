import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Appointment } from "./appointment.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
@Injectable()
export class AppointmentService {
  private readonly API_URL = "assets/data/appointment.json";
  dataChange: BehaviorSubject<Appointment[]> = new BehaviorSubject<
    Appointment[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {}
  get data(): Appointment[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllAppointments(): void {
    this.httpClient.get<Appointment[]>(this.API_URL).subscribe(
      (data) => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + " " + error.message);
      }
    );
  }
  // DEMO ONLY, you can find working methods below
  addAppointment(appointment: Appointment): void {
    this.dialogData = appointment;
  }
  updateAppointment(appointment: Appointment): void {
    this.dialogData = appointment;
  }
  deleteAppointment(id: number): void {
    console.log(id);
  }
}
