import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DownlineState } from './downline-state.component';
describe('FaqsComponent', () => {
  let component: DownlineState;
  let fixture: ComponentFixture<DownlineState>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DownlineState]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DownlineState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
