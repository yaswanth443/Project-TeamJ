import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantDashboardRecurringComponent } from './restaurant-dashboard-recurring.component';

describe('RestaurantDashboardRecurringComponent', () => {
  let component: RestaurantDashboardRecurringComponent;
  let fixture: ComponentFixture<RestaurantDashboardRecurringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantDashboardRecurringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantDashboardRecurringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
