import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDieticiansComponent } from './list-dieticians.component';

describe('ListDieticiansComponent', () => {
  let component: ListDieticiansComponent;
  let fixture: ComponentFixture<ListDieticiansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDieticiansComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDieticiansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
