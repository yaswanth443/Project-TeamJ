import { HttpParams } from '@angular/common/http';
import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AppConstants } from '../../../model/app-constants';
import { RecurringOrderDetails } from '../../../model/order-details';
import { ItemWeightsAndPrices } from '../../../model/user-detail';
import { SharedService } from '../../../service/shared.service';

@Component({
  selector: 'app-restaurant-pending-recurring-dialog',
  templateUrl: './restaurant-pending-recurring-dialog.component.html',
  styleUrls: ['./restaurant-pending-recurring-dialog.component.scss']
})
export class RestaurantPendingDialogComponent implements OnInit{

  orderNumber!: string;
  orderStatusCode!: string;
  showError: boolean = false;
  childItemNames!: string[];
  cartItems: any[] = new Array<any>();
  dataSource!: MatTableDataSource<RecurringOrderDetails>;
  displayedColumns: string[] = ['itemName', 'childItems', 'quantityAndUnit', 'instructions', 'fromDate', 'toDate', 'deliveryTime', 'childItemName'];

  constructor(public dialogRef: MatDialogRef<RestaurantPendingDialogComponent>,
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

  getChildItemNames(childItems: string) {
    let names: string[] = childItems.split(",");
    return names;
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

  createOrder() {
    this.dataSource.data.forEach(item => {
      if (item.selectedChildItem && item.selectedChildItem != '') {
        this.cartItems.push({
          recurringOrderId: item.orderId,
          parentItemName: item.itemName,
          childItemName: item.selectedChildItem
        });
      }
    });    

    this._sharedService.post(AppConstants.NEW_ORDER_FOR_RECURRING_ORDER, this.cartItems).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        this._sharedService.displayMessage("Order created successfully", "green-snackbar");
        this.close();
      },
      error: (err) => console.log("Error loading data: " + err)
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
