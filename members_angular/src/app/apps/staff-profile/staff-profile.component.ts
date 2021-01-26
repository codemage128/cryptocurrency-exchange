import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/security/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { TfaModalComponent } from '../tfa-modal/tfa.component'
import { MatSnackBar } from '@angular/material/snack-bar';
import { MustMatch } from 'src/app/authentication/mustMatch';
import *  as  Config from 'config.json';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff-profile',
  templateUrl: './staff-profile.component.html',
  styleUrls: ['./staff-profile.component.sass']
})
export class StaffProfileComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  form: FormGroup;
  errorMsg: string = '';
  errorWalletMsg: string = '';
  success: number = 0;
  pincode: number = 0;
  userPin: number = 0;
  pinErrorMsg: string = '';
  tfa_alow: boolean = false;
  etfa_alow: boolean = false;
  id: string = '';
  chide = true;
  hide = true;
  baseApi: string = Config.api.baseApi;
  walletForm: FormGroup;
  referralId: string = '';
  isEditing: boolean;
  pendingValue: string;
  valueChangeEvents: EventEmitter<string>;
  btcWalletAddress: string = '';
  ltcWalletAddress: string = '';
  dogeWalletAddress: string = '';
  referralError: string = '';

  get formCtrl() {
    return this.form.controls;
  }
  get walletFormCtrl() {
    return this.walletForm.controls;
  }
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.firstName = localStorage.getItem('auth:firstName');
    this.lastName = localStorage.getItem('auth:lastName');
    this.email = localStorage.getItem('auth:uname');

    this.form = this.formBuilder.group({
      pinCode: ['', Validators.required],
      confirmPincode: ['', Validators.required],
    }, {
      validator: MustMatch('pinCode', 'confirmPincode')
    })

    this.isEditing = false;
    this.pendingValue = '';
    this.valueChangeEvents = new EventEmitter();

    this.walletForm = this.formBuilder.group({
      btcAddress: [''],
      ltcAddress: [''],
      dogeAddress: ['']
    })
  }
  ngOnInit(): void {
    this.getUserInfo();
    Swal.close();
  }
  edit() {
    this.pendingValue = this.referralId;
    this.isEditing = true;
  }
  processChanges() {
    console.log('pending value', this.pendingValue.length);
    if (this.pendingValue.length < 5 || this.pendingValue.length > 30) {
      this.referralError = 'Referral username length should be between 5 to 30';
      return false;
    }
    if (this.pendingValue != this.referralId) {
      this.valueChangeEvents.emit(this.pendingValue);
      const reqData = {
        referral_id: this.pendingValue
      }
      console.log('req data', reqData);
      let token = localStorage.getItem('auth:token');
      if (!token) return;
      const apiUrl = this.baseApi + '/users/' + this.id;
      const headers = { 'Authorization': 'Bearer ' + token };
      this.http.put(apiUrl, reqData, {
        headers: headers
      }).subscribe(async (response: any) => {
        if (response.message == 'The Referral Name Already Exist!') {
          return this.snackBar.open(response.message, '', {
            duration: 2000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: 'snackbar-danger'
          });
        }
        await this.getUserInfo();
        this.snackBar.open('Successfully saved!', '', {
          duration: 2000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: 'snackbar-success'
        });
      }, (error: any) => {
        this.snackBar.open('Failed', '', {
          duration: 2000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: 'snackbar-danger'
        });
      });
    }
    this.isEditing = false;
  }
  cancel() {
    this.isEditing = false;
  }
  getUserInfo() {
    let token = localStorage.getItem('auth:token');
    if (!token) return;
    const apiUrl = this.baseApi + '/users/current';
    const headers = { 'Authorization': 'Bearer ' + token };
    this.http.get<any>(apiUrl, { headers }).subscribe((response: any) => {
      this.id = response.id;
      this.userPin = response.pinCode;
      this.tfa_alow = response.tfa_allow;
      this.etfa_alow = response.etfa_allow;
      this.referralId = response.referral_id;
      this.btcWalletAddress = response.btc_wallet_address;
      this.ltcWalletAddress = response.ltc_wallet_address;
      this.dogeWalletAddress = response.doge_wallet_address;
    })
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  openDialog() {
    this.dialog.open(TfaModalComponent, {});
  }
  closeDialog() {
    this.dialog.closeAll();
  }
  etfa_allow(data) {
    this.getUserInfo();
    const reqData = {
      etfa_allow: data
    }
    let token = localStorage.getItem('auth:token');
    if (!token) return;
    const apiUrl = this.baseApi + '/users/' + this.id;
    const headers = { 'Authorization': 'Bearer ' + token };
    this.http.put(apiUrl, reqData, {
      headers: headers
    }).subscribe(async (data) => {
      this.getUserInfo();
      if (this.etfa_alow === reqData.etfa_allow && !this.etfa_alow)
        return this.snackBar.open('Already turned off', '', {
          duration: 2000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: 'snackbar-warning'
        });
      if (this.etfa_alow === reqData.etfa_allow && this.etfa_alow)
        return this.snackBar.open('Already turned on', '', {
          duration: 2000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: 'snackbar-warning'
        });
      this.snackBar.open('Successfully updated', '', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'snackbar-success'
      });
    });
  }
  tfa_allow(data) {
    this.getUserInfo();
    const reqData = {
      tfa_allow: data
    };
    let token = localStorage.getItem('auth:token');
    if (!token) return;
    const apiUrl = this.baseApi + '/users/' + this.id;
    const headers = { 'Authorization': 'Bearer ' + token };
    this.http.put(apiUrl, reqData, {
      headers: headers
    }).subscribe(async (data) => {
      if (!this.tfa_alow)
        return alert('already turned off');
      alert('successfully updated!');
      this.closeDialog();
      await this.getUserInfo();
      if (this.tfa_alow) {
        setTimeout(() => {
          this.authService.logout().subscribe((res) => {
            if (!res.success) {
              this.router.navigate(['/authentication/signin']);
            }
          });
        }, 10000);
      }
    });
  }
  updateWalletAddress() {
    if (this.btcWalletAddress != null || this.ltcWalletAddress != null || this.dogeWalletAddress != null && this.userPin == null && this.tfa_alow != true) {
      return Swal.fire({
        title: 'Secure',
        text: 'Please set pin code before update wallet address',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Yes'
      })
    }
    console.log('pincode', this.userPin);
    if (this.userPin != null) {
      return Swal.fire({
        title: 'Please type your pin code',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'OK',
        showLoaderOnConfirm: true,
        preConfirm: userPin => {
          let token = localStorage.getItem('auth:token');
          const headers = { 'Authorization': 'Bearer ' + token };
          return fetch(`//share2riches.com:4000/users/pin-check/${userPin}`, { headers })
            .then(response => {
              if (!response.ok) {
                throw new Error(response.statusText);
              }
              return response.json();
            })
            .catch(error => {
              Swal.showValidationMessage(`Pin code does not matched`);
            });
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then(result => {
        this.updateAddressFunction();
      })
    }
    this.updateAddressFunction();
  }

  updateAddressFunction() {
    var reqData = {};
    if (this.walletForm.get('btcAddress').value != '') {
      Object.assign(reqData, { btc_wallet_address: this.walletForm.get('btcAddress').value });
    }
    if (this.walletForm.get('ltcAddress').value != '') {
      Object.assign(reqData, { ltc_wallet_address: this.walletForm.get('ltcAddress').value });
    }
    if (this.walletForm.get('dogeAddress').value != '') {
      Object.assign(reqData, { doge_wallet_address: this.walletForm.get('dogeAddress').value });
    }
    console.log('req data', reqData);
    console.log('here id', this.id);
    let token = localStorage.getItem('auth:token');
    if (!token) return;
    const apiUrl = this.baseApi + '/users/' + this.id;
    const headers = { 'Authorization': 'Bearer ' + token };
    this.http.put(apiUrl, reqData, {
      headers: headers
    }).subscribe(
      (response: any) => {
        console.log('update wallet address', response);
        if (response.message) {
          this.snackBar.open(response.message, '', {
            duration: 6000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: 'snackbar-danger'
          });
        } else {
          this.snackBar.open('Wallet addresses successfully saved!', '', {
            duration: 2000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: 'snackbar-success'
          });
        }
      }, (error: any) => {
        this.snackBar.open(error.error.message, '', {
          duration: 6000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: 'snackbar-danger'
        });
      });
  }
  editReferrerName() {

  }
  savePinCode() {
    if (this.form.valid) {
      if (this.form.get('pinCode').value.toString().length < 4) {
        this.pinErrorMsg = 'Pin code must be at least 4 digits'
        return false;
      }
      if (this.form.get('pinCode').value.toString().length > 30) {
        this.pinErrorMsg = 'PIN code must be no more than 30 digits.'
        return false;
      }
      let reqData;
      if (this.pincode != 0) {
        reqData = {
          pincode: this.pincode,
        }
      } else {
        reqData = {
          pincode: this.form.get('pinCode').value,
        }
      }
      if (reqData) {
        let token = localStorage.getItem('auth:token');
        if (!token) return;
        const headers = { 'Authorization': 'Bearer ' + token };
        this.http.post(this.baseApi + '/users/setPincode', reqData, { headers }).subscribe(
          (response: any) => {
            this.getUserInfo();
            this.snackBar.open('Pin code successfully saved!', '', {
              duration: 2000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              panelClass: 'snackbar-success'
            });
          },
          (error: any) => {
            this.snackBar.open('Failed to save pin code', '', {
              duration: 6000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              panelClass: 'snackbar-danger'
            });
          }
        )
      }
    }
  }
}
