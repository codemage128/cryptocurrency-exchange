import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Payment } from './payment.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable()
export class PaymentService {
  private readonly API_URL = 'assets/data/payment.json';
  dataChange: BehaviorSubject<Payment[]> = new BehaviorSubject<Payment[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {}
  get data(): Payment[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllPayments(): void {
    this.httpClient.get<Payment[]>(this.API_URL).subscribe(
      data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }
  // DEMO ONLY, you can find working methods below
  addPayment(payment: Payment): void {
    this.dialogData = payment;
  }
  updatePayment(payment: Payment): void {
    this.dialogData = payment;
  }
  deletePayment(id: number): void {
    console.log(id);
  }
}
