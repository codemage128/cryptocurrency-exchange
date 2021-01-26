import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Staff } from './staff.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable()
export class StaffService {
  private readonly API_URL = 'assets/data/staff.json';
  dataChange: BehaviorSubject<Staff[]> = new BehaviorSubject<Staff[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {}
  get data(): Staff[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllStaffs(): void {
    this.httpClient.get<Staff[]>(this.API_URL).subscribe(
      data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }
  // DEMO ONLY, you can find working methods below
  addStaff(staff: Staff): void {
    this.dialogData = staff;
  }
  updateStaff(staff: Staff): void {
    this.dialogData = staff;
  }
  deleteStaff(id: number): void {
    console.log(id);
  }
}
