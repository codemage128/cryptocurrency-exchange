import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TfaSigninComponent } from './tfa.component';
describe('SigninComponent', () => {
  let component: TfaSigninComponent;
  let fixture: ComponentFixture<TfaSigninComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TfaSigninComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(TfaSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
