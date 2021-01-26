import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Patient } from './patient.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable()
export class PatientService {
  private readonly API_URL = 'assets/data/patient.json';
  dataChange: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {}
  get data(): Patient[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllPatients(): void {
    this.httpClient.get<Patient[]>(this.API_URL).subscribe(
      data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }
  // DEMO ONLY, you can find working methods below
  addPatient(patient: Patient): void {
    this.dialogData = patient;
  }
  updatePatient(patient: Patient): void {
    this.dialogData = patient;
  }
  deletePatient(id: number): void {
    console.log(id);
  }
}
