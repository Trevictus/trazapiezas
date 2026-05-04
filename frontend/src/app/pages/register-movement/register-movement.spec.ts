import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMovement } from './register-movement';

describe('RegisterMovement', () => {
  let component: RegisterMovement;
  let fixture: ComponentFixture<RegisterMovement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterMovement],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterMovement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
