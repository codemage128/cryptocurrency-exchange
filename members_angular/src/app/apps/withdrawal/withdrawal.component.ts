import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import *  as  Config from 'config.json';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.sass']
})
export class WithdrawalComponent implements OnInit {

  amount: number = 0;
  coinType: string = '';
  baseApi: string = Config.api.baseApi;
  btcWalletAddress: string = '';
  ltcWalletAddress: string = '';
  dogeWalletAddress: string = '';
  walletAddress: string = '';
  btcBalance: number = 0;
  ltcBalance: number = 0;
  dogeBalance: number = 0;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getUserInfo();
    this.getBalance();
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

  async getUserInfo() {
    let token = localStorage.getItem('auth:token');
    if (!token) return;
    const apiUrl = this.baseApi + '/users/current';
    const headers = { 'Authorization': 'Bearer ' + token };
    await this.http.get<any>(apiUrl, { headers }).subscribe(
      (response: any) => {
        if (response.btc_wallet_address == null && response.ltc_wallet_address == null && response.doge_wallet_address == null) {
          Swal.fire({
            title: '<strong>No wallet address found</strong>',
            icon: 'info',
            html:
              'Please click ' +
              '<a href="/#/members/profile/member-profile">HERE</a> ' +
              'to update your wallet address',
            showCloseButton: false,
            showCancelButton: false,
            confirmButtonText: 'Cancel',
            focusConfirm: false
          });
          return;
        }
        this.btcWalletAddress = response.btc_wallet_address;
        this.ltcWalletAddress = response.ltc_wallet_address;
        this.dogeWalletAddress = response.doge_wallet_address;
      },
      (error: any) => {
        console.log(error);
      })
  }

  returnSettings() {
    console.log('return settings');
    Swal.close();
  }

  customWithFunction() {
    switch (this.coinType) {
      case 'BTC':
        this.walletAddress = this.btcWalletAddress;
        break;
      case 'LTC':
        this.walletAddress = this.ltcWalletAddress;
        break;
      case 'DOGE':
        this.walletAddress = this.dogeWalletAddress;
        break;
    }
    Swal.fire({
      title: 'Are you sure?',
      html: 'Coin type: ' + this.coinType + '</br>' + 'Coin ammount: $' + this.amount + '</br>' + 'Wallet address: ' + this.walletAddress,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Withdraw'
    }).then(async result => {
      const reqData = {
        coinType: this.coinType,
        amount: this.amount,
      }
      if (result.value) {
        let token = localStorage.getItem('auth:token');
        if (!token) return;
        const apiUrl = this.baseApi + '/coins/withdraw';
        const headers = { 'Authorization': 'Bearer ' + token };
        await this.http.post<any>(apiUrl, reqData, { headers }).subscribe(
          (response: any) => {
            console.log(response);
            if (response.message == 'Successfully withdrawed') {
              this.getUserInfo();
              this.getBalance();
              this.snackBar.open('Successfully withdrawed', '', {
                duration: 2000,
                verticalPosition: 'bottom',
                horizontalPosition: 'center',
                panelClass: 'snackbar-success'
              });
            }
          },
          (error: any) => {
            console.log(error);
            this.snackBar.open(error.error.message, '', {
              duration: 8000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              panelClass: 'snackbar-danger'
            });
          }
        )
      }
    });
  }
}
