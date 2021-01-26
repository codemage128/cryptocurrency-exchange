import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import *  as  Config from 'config.json';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Position {
  value: number;
  viewValue: number;
}
interface Coin {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-buy-position',
  templateUrl: './buy-position.component.html',
  styleUrls: ['./buy-position.component.sass']
})

export class BuyPositionComponent implements OnInit {

  panelOpenState = false;
  step = 0;
  amount: number = 0;
  position_amount: number = 0;
  position_count: number = 0;
  errorMsg: string = '';
  user_id: number = 0;
  total_position: string = '';
  position_price: number = 0.00;
  coin_type: string = '';
  dataUrl: string = '';
  coin_price: number = 0;
  coin_address: string = '';
  data: string = '';
  visibility: string = '';
  distance: number = 900000;
  baseApi: string = Config.api.baseApi;
  positionInfo: any;
  x: any;
  y: any;
  confirm_number: number = undefined;

  position_counts: Position[] = [
    { value: 1, viewValue: 1 },
    { value: 2, viewValue: 2 },
    { value: 3, viewValue: 3 },
    { value: 4, viewValue: 4 },
  ];

  coin_types: Coin[] = [
    { value: 'btc', viewValue: 'BTC' },
    { value: 'doge', viewValue: 'DOGE' },
    { value: 'ltc', viewValue: 'LTC' },
  ];

  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }
  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.router.events.subscribe(() => {
      clearInterval(this.x);
    })
  }
  ngOnInit() {
    // this.y = setInterval(() => {
    //   this.getPaymentStatus();
    // }, 5000);
    this.getPositionPrice();
    this.getUserInfo();
    console.log('baseapi', Config.api.baseApi);
  }
  async countdownTimer() {
    var distance = this.distance;
    this.x = setInterval(() => {
      distance -= 1000;
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById("demo").innerHTML = minutes + "m " + seconds + "s ";

      if (distance < 0) {
        clearInterval(this.x);
        this.visibility = 'block';
        this.dataUrl = '';
      }
    }, 1000);
  }
  goToBuyPosition() {
    this.visibility = 'block';
    this.dataUrl = '';
  }
  async getPositionPrice() {
    const apiUrl = this.baseApi + '/positions/getpositionprice';
    await this.http.get<any>(apiUrl).subscribe(
      (response: any) => {
        this.position_price = response.origin_price;
      },
      (error: any) => {
        console.log(error);
      })
  }

  async getPaymentStatus() {
    const apiUrl = this.baseApi + '/coins/paymentstatus';

    await this.http.post<any>(apiUrl, { user_id: this.user_id }).subscribe(
      (response: any) => {
        console.log('response', response);
        this.positionInfo = response;
        clearInterval(this.x);
      },
      (error: any) => {
        console.log(error);
      })
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 100000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  showNotification_success(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 3000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  async getPositionCount() {
    const apiUrl = this.baseApi + '/coins/get-positioncount/' + this.user_id;
    await this.http.get<any>(apiUrl).subscribe(
      (response: any) => {
        this.total_position = response;
      },
      (error: any) => {
        console.log(error);
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
        this.getPositionCount();
      },
      (error: any) => {
        console.log(error);
      })
  }
  customWithFunction(cointype, amount) {
    console.log('cointype', cointype, amount);
    this.position_count = amount;
    if (amount == undefined)
      return;
    Swal.fire({
      title: 'Are you sure?',
      html: "Position price: $" + this.position_price + '</br>' + "Amount of positions: " + amount + '</br>' + "Total price: $" + this.position_price * amount + '</br>' + "Coin type: " + cointype.toUpperCase(),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.value) {
        const reqData = {
          amounts: amount,
          cointype: cointype,
          id: this.user_id,
        }
        const apiUrl = this.baseApi + '/coins/genqrcode';
        await this.http.post<any>(apiUrl, reqData).subscribe(
          async (response: any) => {
            console.log(response);
            this.dataUrl = response.dataUrl;
            this.coin_type = response.cointype;
            this.coin_price = response.amount;
            this.coin_address = response.coinaddress;
            this.data = response.data;
            this.visibility = 'none';
            this.countdownTimer();
            if (response.dataUrl != '') {
            }
          },
          (error: any) => {
            console.log(error);
          })
        // const apiUrl = this.baseApi + '/coins/withdrawcoin';
        // await this.http.post<any>(apiUrl, reqData).subscribe(
        //   async (response: any) => {
        //     console.log(response);
        //     this.total_position = response;
        //     Swal.fire('Good news!', amount + 'positions has been successfully buyed.', 'success');
        //   },
        //   (error: any) => {
        //     console.log(error);
        //   })
      }
    });
  }
}
