import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayAppointmentComponent } from './today-appointment.component';

describe('TodayAppointmentComponent', () => {
  let component: TodayAppointmentComponent;
  let fixture: ComponentFixture<TodayAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodayAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodayAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
