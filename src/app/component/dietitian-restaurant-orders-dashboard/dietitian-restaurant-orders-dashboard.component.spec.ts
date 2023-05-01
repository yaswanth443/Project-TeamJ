import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRestaurantOrdersDashboardComponent } from './customer-restaurant-orders-dashboard.component';

describe('CustomerRestaurantOrdersDashboardComponent', () => {
  let component: CustomerRestaurantOrdersDashboardComponent;
  let fixture: ComponentFixture<CustomerRestaurantOrdersDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerRestaurantOrdersDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerRestaurantOrdersDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
