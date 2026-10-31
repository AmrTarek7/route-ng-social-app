import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePostModalComponent } from './share-post-modal.component';

describe('SharePostModalComponent', () => {
  let component: SharePostModalComponent;
  let fixture: ComponentFixture<SharePostModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharePostModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharePostModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
