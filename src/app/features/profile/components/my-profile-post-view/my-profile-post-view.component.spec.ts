import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfilePostViewComponent } from './my-profile-post-view.component';

describe('MyProfilePostViewComponent', () => {
  let component: MyProfilePostViewComponent;
  let fixture: ComponentFixture<MyProfilePostViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfilePostViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfilePostViewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
