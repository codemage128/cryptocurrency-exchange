import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import *  as  Config from 'config.json';

export interface PeriodicElement {
  name: string;
  no: number;
  gender: string;
  email: string;
  address: string;
  mobile: number;
  salary: number;
}

@Component({
  selector: 'app-material-table',
  templateUrl: './material-table.component.html',
  styleUrls: ['./material-table.component.sass']
})
export class MaterialTableComponent implements OnInit {
  user_id: number = 0;
  baseApi: string = Config.api.baseApi;
  positionInfo: any;
  fundsInfo; any;

  displayedColumns: string[] = ['no', 'type', 'amount', 'address', 'date'];
  displayedFundsColumns: string[] = ['position_id', 'funds_amounts'];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }
  constructor(
    private http: HttpClient,
  ) { }
  ngOnInit() {
    this.getUserInfo();
    setTimeout(() => {
      this.getPaymentStatus();
    }, 2000);
    setTimeout(() => {
      this.getFundsHistory();
    }, 2000);

  }
  async getFundsHistory() {
    let token = localStorage.getItem('auth:token');
    if (!token) return;
    const apiUrl = this.baseApi + '/coins/getfundshistory';
    const headers = { 'Authorization': 'Bearer ' + token }
    await this.http.get<any>(apiUrl, { headers }).subscribe(
      (response: any) => {
        console.log('here response userinfo', response);
        var sums = {};
        for (var i = 0; i < response.length; i++) {
          var obj = response[i];
          sums[obj.position_id] = sums[obj.position_id] === undefined ? 0 : sums[obj.position_id];
          sums[obj.position_id] += parseFloat(obj.funds);
        }

        console.log(sums);
        const entries = Object.entries(sums);
        console.log('entries', entries);
        this.fundsInfo = entries;
      },
      (error: any) => {
        console.log(error);
      })
  }
  async getUserInfo() {
    let token = localStorage.getItem('auth:token');
    if (!token) return;
    const apiUrl = this.baseApi + '/users/current';
    const headers = { 'Authorization': 'Bearer ' + token }
    await this.http.get<any>(apiUrl, { headers }).subscribe(
      (response: any) => {
        console.log('here response userinfo', response);
        this.user_id = response.id;
      },
      (error: any) => {
        console.log(error);
      })
  }

  async getPaymentStatus() {
    const apiUrl = this.baseApi + '/coins/paymentstatus';

    await this.http.post<any>(apiUrl, { user_id: this.user_id }).subscribe(
      (response: any) => {
        console.log('payment status response', response);
        this.positionInfo = response;
      },
      (error: any) => {
        console.log(error);
      })
  }
}
