import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllItemsComponent } from './list-all-items.component';

describe('ListAllItemsComponent', () => {
  let component: ListAllItemsComponent;
  let fixture: ComponentFixture<ListAllItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAllItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAllItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
