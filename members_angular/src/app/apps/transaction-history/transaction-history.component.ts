import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import *  as  Config from 'config.json';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.sass']
})
export class TransactionHistoryComponent implements OnInit {
  user_id: number = 0;
  baseApi: string = Config.api.baseApi;
  positionInfo: any;
  fundsInfo; any;

  displayedColumns: string[] = ['no', 'type', 'amount', 'address', 'date'];
  displayedFundsColumns: string[] = ['position_id', 'funds_amounts'];

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.getUserInfo();
  }

  ngAfterViewInit() {
    this.getPaymentStatus();
    // this.getFundsHistory();
  }

  async getFundsHistory() {
    let token = localStorage.getItem('auth:token');
    if (!token) return;
    const apiUrl = this.baseApi + '/coins/getfundshistory';
    const headers = { 'Authorization': 'Bearer ' + token }
    await this.http.get<any>(apiUrl, { headers }).subscribe(
      (response: any) => {
        var sums = {};
        for (var i = 0; i < response.length; i++) {
          var obj = response[i];
          sums[obj.position_id] = sums[obj.position_id] === undefined ? 0 : sums[obj.position_id];
          sums[obj.position_id] += parseFloat(obj.funds);
        }
        const entries = Object.entries(sums);
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
        console.log('payment response =>', response.toString());
        if (response.toString() != '') {
          this.positionInfo = response;
          console.log('not empty array');
        } else {
          console.log('here empty array');
          this.positionInfo = null;
        }
      },
      (error: any) => {
        console.log(error);
      })
  }
}
