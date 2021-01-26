import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AllpaymentComponent } from './allpayment.component';
describe('AllpaymentComponent', () => {
  let component: AllpaymentComponent;
  let fixture: ComponentFixture<AllpaymentComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllpaymentComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AllpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
