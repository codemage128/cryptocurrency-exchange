import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AllstaffComponent } from './allstaff.component';
describe('AllstaffComponent', () => {
  let component: AllstaffComponent;
  let fixture: ComponentFixture<AllstaffComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllstaffComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AllstaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
