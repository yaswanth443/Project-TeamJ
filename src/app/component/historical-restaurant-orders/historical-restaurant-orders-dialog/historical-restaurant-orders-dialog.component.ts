import { HttpParams } from '@angular/common/http';
import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { AppConstants } from '../../../model/app-constants';
import { Orders } from '../../../model/order-details';
import { LookupUnits } from '../../../model/user-detail';
import { SharedService } from '../../../service/shared.service';

@Component({
  selector: 'app-historical-restaurant-orders-dialog',
  templateUrl: './historical-restaurant-orders-dialog.component.html',
  styleUrls: ['./historical-restaurant-orders-dialog.component.scss']
})
export class HistoricalRestaurantDialogComponent implements OnInit{

  dataSource!: Orders;
  nextOrderStatus!: LookupUnits;
  nextStatusValue!: string;
  cartTotal: number = 0;
  
  constructor(public dialogRef: MatDialogRef<HistoricalRestaurantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private _sharedService: SharedService) {
    this.dataSource = data.element;
  }

  ngOnInit() {
    this.loadOrderData();
    this.dataSource.orderItems.forEach(item => {
      if (item.itemWeightsAndPrices && item.itemWeightsAndPrices.itemPrice) {
        this.cartTotal = this.cartTotal + item.itemWeightsAndPrices.itemPrice;
      }
    })
  }

  loadOrderData() {
    const params = new HttpParams().set("orderId", this.dataSource.orderId);
    this._sharedService.getWithParams(AppConstants.RESTAURANT_NEXT_STATUS, params).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        this.nextOrderStatus = JSON.parse(res);
        if (this.nextOrderStatus.unitLookupCode == 'ORDER_STATUS_2') {
          this.nextStatusValue = "Confirm Order";
        } else if (this.nextOrderStatus.unitLookupCode == 'ORDER_STATUS_3') {
          this.nextStatusValue = "Confirm Order Preparation";
        } else if (this.nextOrderStatus.unitLookupCode == 'ORDER_STATUS_4') {
          this.nextStatusValue = "Assign Delivery person";
        } else if (this.nextOrderStatus.unitLookupCode == 'ORDER_STATUS_5') {
          this.nextStatusValue = "Start delivery";
        } else if (this.nextOrderStatus.unitLookupCode == 'ORDER_STATUS_6') {
          this.nextStatusValue = "Confirm Delivery";
        }
      },
      error: (err) => console.log("Error loading data: " + err)
    });
  }

  confirm() {
    const params = new HttpParams().set("orderId", this.dataSource.orderId);
    this._sharedService.postWithParams(AppConstants.RESTAURANT_NEXT_STATUS, {}, params).pipe(
      take(1)
    ).subscribe((res) => {
      this.loadOrderData();
      this.close();
    },
      (err) => console.log("Error loading data: " + err)
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
