import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostLikesComponent } from './post-likes.component';

describe('PostLikesComponent', () => {
  let component: PostLikesComponent;
  let fixture: ComponentFixture<PostLikesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostLikesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostLikesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
