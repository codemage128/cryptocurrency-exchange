import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Members } from './members.model'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import  *  as  Config  from  'config.json';

@Injectable()
export class MembersService {
  private readonly API_URL = 'assets/data/doctors.json';
  dataChange: BehaviorSubject<Members[]> = new BehaviorSubject<Members[]>([]);
  dialogData: any;
  baseApi: string = Config.api.baseApi;
  constructor(private httpClient: HttpClient) {}
  get data(): Members[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  
  getAllMemberss(): void {
    let token = localStorage.getItem('auth:token');
    if (!token) return;
    console.log("token string", typeof (token));
    const apiUrl = this.baseApi + '/users';
    const headers = { 'Authorization': 'Bearer ' + token };
    this.httpClient.get<any>(apiUrl, { headers }).subscribe((response: any) => {
      this.dataChange.next(response);
      console.log(this.dataChange.next(response));
    });
  }
  
  // DEMO ONLY, you can find working methods below
  addDoctors(doctors: Members): void {
    this.dialogData = doctors;
  }
  updateDoctors(doctors: Members): void {
    this.dialogData = doctors;
  }
  deleteDoctors(id: number): void {
    console.log(id);
  }
}
