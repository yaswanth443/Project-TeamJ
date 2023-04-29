import { HttpParams } from '@angular/common/http';
import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AppConstants } from '../../../model/app-constants';
import { OrderItems } from '../../../model/order-details';
import { SharedService } from '../../../service/shared.service';

@Component({
  selector: 'app-customer-live-dialog',
  templateUrl: './customer-live-dialog.component.html',
  styleUrls: ['./customer-live-dialog.component.scss']
})
export class CustomerOrderLiveDialogComponent implements OnInit{

  orderNumber!: string;
  orderStatusCode!: string;
  showError: boolean = false;
  dataSource!: OrderItems[];
  cartTotal: number = 0;
  displayedColumns: string[] = ['childItemName', 'quantityAndUnit', 'quantity', 'itemPrice'];

  constructor(@Inject(MAT_DIALOG_DATA) data: any,
    private _sharedService: SharedService) {
    this.dataSource = data.element.orderItems;
  }

  ngOnInit() {
    this.dataSource.forEach(item => {
      if (item.itemWeightsAndPrices && item.itemWeightsAndPrices.itemPrice) {
        this.cartTotal = this.cartTotal + item.itemWeightsAndPrices.itemPrice;
      }
    })
  }
}
