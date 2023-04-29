import { HttpParams } from '@angular/common/http';
import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AppConstants } from '../../../model/app-constants';
import { RecurringOrderDetails } from '../../../model/order-details';
import { SharedService } from '../../../service/shared.service';

@Component({
  selector: 'app-dietitian-dashboard-recurring-dialog',
  templateUrl: './dietitian-dashboard-recurring-dialog.component.html',
  styleUrls: ['./dietitian-dashboard-recurring-dialog.component.scss']
})
export class DietitianRecurringDialogComponent implements OnInit{

  orderNumber!: string;
  orderStatusCode!: string;
  orderTotalAmount: number = 0;
  showError: boolean = false;
  dataSource!: MatTableDataSource<RecurringOrderDetails>;
  displayedColumns: string[] = ['restaurantName', 'itemName', 'childItems', 'quantityAndUnit', 'instructions', 'fromDate', 'toDate', 'deliveryTime', 'price'];

  constructor(public dialogRef: MatDialogRef<DietitianRecurringDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private _sharedService: SharedService) {
    this.orderNumber = data.orderNumber;
    this.orderStatusCode = data.orderStatusCode;
  }

  ngOnInit() {
    this._sharedService.get(AppConstants.GET_RECURRING_ORDER_DET_BY_DIET.replace("{orderId}", this.orderNumber)).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.data.forEach(data => {
          this.orderTotalAmount = this.orderTotalAmount + data.price;
        })
      },
      error: (err) => console.log("Error loading data: " + err)
    });
  }

  submit() {
    this.dataSource.data.forEach(data => {
      if (data.price == null) {
        this._sharedService.displayMessage("Not all restaurants have quoted the price", "green-snackbar");
        return;
      }
    });
    const params = new HttpParams()
      .set('orderId', this.orderNumber);
    if (this.showError === false) {
      this._sharedService.postWithParams(AppConstants.UPD_NEW_RECURRING_ORDER_DIET, this.dataSource.data, params).pipe(
        take(1)
      ).subscribe({
        next: (res) => {
          this._sharedService.displayMessage("Paid and confirmed successfully", "green-snackbar");
          this.close();
        },
        error: (err) => console.log("Error loading data: " + err)
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
