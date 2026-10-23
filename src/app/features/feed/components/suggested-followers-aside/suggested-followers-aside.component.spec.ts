import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedFollowersAsideComponent } from './suggested-followers-aside.component';

describe('SuggestedFollowersAsideComponent', () => {
  let component: SuggestedFollowersAsideComponent;
  let fixture: ComponentFixture<SuggestedFollowersAsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestedFollowersAsideComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuggestedFollowersAsideComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
