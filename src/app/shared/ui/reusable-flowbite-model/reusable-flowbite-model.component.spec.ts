import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableFlowbiteModelComponent } from './reusable-flowbite-model.component';

describe('ReusableFlowbiteModelComponent', () => {
  let component: ReusableFlowbiteModelComponent;
  let fixture: ComponentFixture<ReusableFlowbiteModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableFlowbiteModelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReusableFlowbiteModelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
