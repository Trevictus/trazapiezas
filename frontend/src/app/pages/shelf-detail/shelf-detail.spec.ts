import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfDetailComponent } from './shelf-detail';

describe('ShelfDetailComponent', () => {
  let component: ShelfDetailComponent;
  let fixture: ComponentFixture<ShelfDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelfDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShelfDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
