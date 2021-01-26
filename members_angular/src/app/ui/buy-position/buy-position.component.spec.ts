import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BuyPositionComponent } from './buy-position.component';
describe('ExpansionPanelComponent', () => {
  let component: BuyPositionComponent;
  let fixture: ComponentFixture<BuyPositionComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuyPositionComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(BuyPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
