import { HttpParams } from '@angular/common/http';
import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AppConstants } from '../../../model/app-constants';
import { RecurringOrderDetails } from '../../../model/order-details';
import { SharedService } from '../../../service/shared.service';

@Component({
  selector: 'app-restaurant-dashboard-recurring-dialog',
  templateUrl: './restaurant-dashboard-recurring-dialog.component.html',
  styleUrls: ['./restaurant-dashboard-recurring-dialog.component.scss']
})
export class RestaurantRecurringDialogComponent implements OnInit{

  orderNumber!: string;
  orderStatusCode!: string;
  showError: boolean = false;
  dataSource!: MatTableDataSource<RecurringOrderDetails>;
  displayedColumns: string[] = ['itemName', 'childItems', 'quantityAndUnit', 'instructions', 'fromDate', 'toDate', 'deliveryTime', 'price'];

  constructor(public dialogRef: MatDialogRef<RestaurantRecurringDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private _sharedService: SharedService) {
    this.orderNumber = data.orderNumber;
    this.orderStatusCode = data.orderStatusCode;
  }

  ngOnInit() {
    this._sharedService.get(AppConstants.GET_RECURRING_ORDER_BY_NUMB.replace("{orderId}", this.orderNumber)).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
      },
      error: (err) => console.log("Error loading data: " + err)
    });
  }

  submit() {
    this.showError = false;
    this.dataSource.data.forEach(data => {
      if (data.price == null) {
        this.showError = true;
        return;
      }
    });
    if (this.showError === false) {
      this._sharedService.post(AppConstants.UPD_NEW_RECURRING_ORDER, this.dataSource.data).pipe(
        take(1)
      ).subscribe({
        next: (res) => {
          this._sharedService.displayMessage("Updated successfully", "green-snackbar");
          this.close();
        },
        error: (err) => console.log("Error loading data: " + err)
      });
    }
  }

  confirm() {
    const params = new HttpParams().set("orderNumber", this.orderNumber);
    this._sharedService.postWithParams(AppConstants.CONFIRM_NEW_RECURRING_ORDER, this.dataSource.data, params).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        this._sharedService.displayMessage("Confirmed successfully", "green-snackbar");
        this.close();
      },
      error: (err) => console.log("Error loading data: " + err)
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
