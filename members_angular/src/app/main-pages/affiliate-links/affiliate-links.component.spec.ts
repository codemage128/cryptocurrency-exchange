import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateLinksComponent } from './affiliate-links.component';

describe('AffiliateLinksComponent', () => {
  let component: AffiliateLinksComponent;
  let fixture: ComponentFixture<AffiliateLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffiliateLinksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliateLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
