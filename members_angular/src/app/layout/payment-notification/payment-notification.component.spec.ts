import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentNotificationComponent } from './payment-notification.component';

describe('PaymentNotificationComponent', () => {
  let component: PaymentNotificationComponent;
  let fixture: ComponentFixture<PaymentNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
