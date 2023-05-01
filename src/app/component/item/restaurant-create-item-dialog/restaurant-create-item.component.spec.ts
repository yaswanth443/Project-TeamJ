import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantCreateItemComponent } from './restaurant-create-item.component';

describe('RestaurantCreateItemComponent', () => {
  let component: RestaurantCreateItemComponent;
  let fixture: ComponentFixture<RestaurantCreateItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantCreateItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantCreateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
