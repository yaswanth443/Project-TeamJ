import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDieticianCustomersComponent } from './list-dietician-customers.component';

describe('ListDieticianCustomersComponent', () => {
  let component: ListDieticianCustomersComponent;
  let fixture: ComponentFixture<ListDieticianCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDieticianCustomersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDieticianCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
