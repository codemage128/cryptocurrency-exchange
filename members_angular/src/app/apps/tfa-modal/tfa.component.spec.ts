import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TfaModalComponent } from './tfa.component';
describe('SigninComponent', () => {
  let component: TfaModalComponent;
  let fixture: ComponentFixture<TfaModalComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TfaModalComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(TfaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
