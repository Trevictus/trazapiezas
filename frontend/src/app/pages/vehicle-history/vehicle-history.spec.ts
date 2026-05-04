import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleHistory } from './vehicle-history';

describe('VehicleHistory', () => {
  let component: VehicleHistory;
  let fixture: ComponentFixture<VehicleHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
