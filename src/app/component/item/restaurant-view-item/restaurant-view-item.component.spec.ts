import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantViewItemComponent } from './restaurant-view-item.component';

describe('RestaurantViewItemComponent', () => {
  let component: RestaurantViewItemComponent;
  let fixture: ComponentFixture<RestaurantViewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantViewItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantViewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
