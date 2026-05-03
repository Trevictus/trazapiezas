import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPartComponent } from './add-part';

describe('AddPartComponent', () => {
  let component: AddPartComponent;
  let fixture: ComponentFixture<AddPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
