import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import *  as  Config from 'config.json';

@Component({
  selector: 'app-payment-notification',
  templateUrl: './payment-notification.component.html',
  styleUrls: ['./payment-notification.component.sass']
})
export class PaymentNotificationComponent implements OnInit {
  user_id: number = 0;
  positionInfo: any;
  baseApi: string = Config.api.baseApi;
  notificationStatus: boolean = true;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // setInterval(() => {
    //   this.getPaymentStatus();
    // }, 5000);
    this.getUserInfo();
    // this.getPaymentStatus();
  }
  async getPaymentStatus() {
    const apiUrl = this.baseApi + '/coins/paymentstatus';

    await this.http.post<any>(apiUrl, { user_id: this.user_id }).subscribe(
      (response: any) => {
        // console.log('response', response.length);
        this.positionInfo = response;
        
        for (var i = 0; i < response.length; i++) {
          if (response[i].confirmation_number == 3 || response[i].confirmation_number == 5 || response[i].confirmation_number == 10) {
            this.showNotification_success(
              'snackbar-success',
              'Successfully payment for ' + response[i].coin_address,
              'bottom',
              'center'
            );
          }
        }
      },
      (error: any) => {
        // console.log(error);
      })
  }

  showNotification_success(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 15000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
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
}
