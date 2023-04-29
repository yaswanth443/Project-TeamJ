import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantDashboardLiveComponent } from './restaurant-dashboard-live.component';

describe('RestaurantDashboardLiveComponent', () => {
  let component: RestaurantDashboardLiveComponent;
  let fixture: ComponentFixture<RestaurantDashboardLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantDashboardLiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantDashboardLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
