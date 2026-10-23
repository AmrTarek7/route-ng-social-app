import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonPostComponent } from './skeleton-post.component';

describe('SkeletonPostComponent', () => {
  let component: SkeletonPostComponent;
  let fixture: ComponentFixture<SkeletonPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonPostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonPostComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
