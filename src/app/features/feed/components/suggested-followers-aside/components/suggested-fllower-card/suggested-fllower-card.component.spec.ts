import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedFllowerCardComponent } from './suggested-fllower-card.component';

describe('SuggestedFllowerCardComponent', () => {
  let component: SuggestedFllowerCardComponent;
  let fixture: ComponentFixture<SuggestedFllowerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestedFllowerCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuggestedFllowerCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
