import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingAppointmentComponent } from './upcoming-appointment.component';

describe('UpcomingUpcommingAppointmentComponent', () => {
  let component: UpcomingAppointmentComponent;
  let fixture: ComponentFixture<UpcomingAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpcomingAppointmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
