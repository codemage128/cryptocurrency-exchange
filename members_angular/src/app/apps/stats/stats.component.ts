import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import *  as  Config from 'config.json';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.sass']
})
export class StatsComponent implements OnInit {

  baseApi: string = Config.api.baseApi;
  btcBalance: number = 0;
  ltcBalance: number = 0;
  dogeBalance: number = 0;
  profitFromPosition: number = 0;
  profitFromAffiliate: number = 0;
  profitFromAll: number = 0;
  positionsCount: number = 0;
  positionsAmount: number = 0;
  reinvestedPositionsNumber: number = 0;
  inactivePositionsNumber: number = 0;
  totalReinvestedAmount: number = 0;
  totalWithdrawnAmount: number = 0;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getBalance();
    this.getEarnings();
    this.getAccount();
  }

  async getBalance() {
    let token = localStorage.getItem('auth:token');
    if (!token) return;
    const apiUrl = this.baseApi + '/coins/get-membercoinbalance';
    const headers = { 'Authorization': 'Bearer ' + token };
    await this.http.get<any>(apiUrl, { headers }).subscribe(
      (response: any) => {
        this.btcBalance = response.btc_amount;
        this.ltcBalance = response.ltc_amount;
        this.dogeBalance = response.doge_amount;
      },
      (error: any) => {
        console.log(error);
      })
  }

  async getEarnings() {
    let token = localStorage.getItem('auth:token');
    if (!token) return;
    const apiUrl = this.baseApi + '/coins/get-memberearnings';
    const headers = { 'Authorization': 'Bearer ' + token };
    await this.http.get<any>(apiUrl, { headers }).subscribe(
      (response: any) => {
        this.profitFromPosition = response.totalPositionProfit;
        this.profitFromAffiliate = response.totalAffiliateProfit;
        this.profitFromAll = response.totalProfit;
      },
      (error: any) => {
        console.log(error);
      })
  }

  async getAccount() {
    let token = localStorage.getItem('auth:token');
    if (!token) return;
    const apiUrl = this.baseApi + '/coins/get-accountinfo';
    const headers = { 'Authorization': 'Bearer ' + token };
    await this.http.get<any>(apiUrl, { headers }).subscribe(
      (response: any) => {
        this.positionsCount = response.positionCounts
        this.positionsAmount = response.totalPositionAmount
        this.totalWithdrawnAmount = response.withdrawAmount
      },
      (error: any) => {
        console.log(error);
      })
  }
}
