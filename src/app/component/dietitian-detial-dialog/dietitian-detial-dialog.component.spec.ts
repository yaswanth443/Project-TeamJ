import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietitianDetialDialogComponent } from './dietitian-detial-dialog.component';

describe('DietitianDetialDialogComponent', () => {
  let component: DietitianDetialDialogComponent;
  let fixture: ComponentFixture<DietitianDetialDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DietitianDetialDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DietitianDetialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
