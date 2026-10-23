import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuNavAsideComponent } from './menu-nav-aside.component';

describe('MenuNavAsideComponent', () => {
  let component: MenuNavAsideComponent;
  let fixture: ComponentFixture<MenuNavAsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuNavAsideComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuNavAsideComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
