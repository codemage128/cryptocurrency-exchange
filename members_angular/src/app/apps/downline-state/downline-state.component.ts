import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import *  as  Config from 'config.json';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-downline-state',
  templateUrl: './downline-state.component.html',
  styleUrls: ['./downline-state.component.scss']
})
export class DownlineState implements OnInit {
  displayedColumns: string[] = ['no', 'username', 'totalEarningAmount', 'totalPurchasedShares', 'totalReinvestedShares', 'email'];
  dataSource = [

  ];
  baseApi: string = Config.api.baseApi;
  levelCount: number = 0;
  levelValue: number = 0

  constructor(
    private http: HttpClient
  ) { }
  ngOnInit() {
    // this.getUserInfo();
    this.getLevelCount();

  }
  spinnerButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Spinner Button',
    spinnerSize: 18,
    raised: true,
    stroked: false,
    buttonColor: 'primary',
    spinnerColor: 'accent',
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    buttonIcon: {
      fontIcon: 'favorite'
    }
  };
  counter(i: number) {
    return new Array(i);
  }
  getUserInfo() {
    let token = localStorage.getItem('auth:token');
    if (!token) return;
    const apiUrl = this.baseApi + '/users/downline-status';
    const headers = { 'Authorization': 'Bearer ' + token };
    this.http.get<any>(apiUrl, { headers }).subscribe(
      (response: any) => {

      }, (error: any) => {

      }
    )
  }

  getLevelCount() {
    let token = localStorage.getItem('auth:token');
    if (!token) return;
    const apiUrl = this.baseApi + '/users/users-bylevel';
    const headers = { 'Authorization': 'Bearer ' + token };
    this.http.get<any>(apiUrl, { headers }).subscribe(
      (response: any) => {
        console.log('level Count', response);
        this.levelCount = response.levelCount;
      }, (error: any) => {

      }
    )
  }

  viewDownlineInfo(value) {
    let token = localStorage.getItem('auth:token');
    if (!token) return;
    const apiUrl = this.baseApi + '/users/downline-status/' + value;
    const headers = { 'Authorization': 'Bearer ' + token };
    this.http.get<any>(apiUrl, { headers }).subscribe(
      (response: any) => {
        var array = [];
        array.push(response);
        this.dataSource = array
        console.log('datasource---', this.dataSource);
      }, (error: any) => {

      }
    )
  }
}
