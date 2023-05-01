import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AppConstants } from '../../model/app-constants';
import { DietitianRecurringOrderDetails } from '../../model/order-details';
import { SubscriptionResponse } from '../../model/user-detail';
import { SharedService } from '../../service/shared.service';
import { RestaurantRecurringDialogComponent } from './restaurant-dashboard-recurring-dialog/restaurant-dashboard-recurring-dialog.component';
import { RestaurantPendingDialogComponent } from './restaurant-pending-recurring-dialog/restaurant-pending-recurring-dialog.component';

@Component({
  selector: 'app-restaurant-dashboard-recurring',
  templateUrl: './restaurant-dashboard-recurring.component.html',
  styleUrls: ['./restaurant-dashboard-recurring.component.scss']
})
export class RestaurantDashboardRecurringComponent implements OnInit {

  dataSource!: MatTableDataSource<DietitianRecurringOrderDetails>;
  displayedColumns: string[] = ['customerName', 'customerAddress', 'dietitianName', 'orderId', 'orderStatus', 'actions'];

  dataSource2!: MatTableDataSource<DietitianRecurringOrderDetails>;
  
  constructor(private sharedService: SharedService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadNewRecurringOrders();
    this.loadPendingRecurringOrdersToCreateOrder();
  }

  loadNewRecurringOrders() {
    this.sharedService.get(AppConstants.GET_NEW_RECURRING_ORDER).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.dataSource = new MatTableDataSource(res);
        }
      },
      error: (err) => console.log("Error loading data: " + err)
    });
  }

  loadPendingRecurringOrdersToCreateOrder() {
    this.sharedService.get(AppConstants.PENDING_RECURRING_ORDER).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.dataSource2 = new MatTableDataSource(res);
        }
      },
      error: (err) => console.log("Error loading data: " + err)
    });
  }

  openDialog(element: DietitianRecurringOrderDetails) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      orderNumber: element.orderId,
      orderStatusCode: element.orderStatusCode
    };
    dialogConfig.width = "90%";
    const dialogRef = this.dialog.open(RestaurantRecurringDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.loadNewRecurringOrders();
    });
  }

  openDialog2(element: DietitianRecurringOrderDetails) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      orderNumber: element.orderId,
      orderStatusCode: element.orderStatusCode
    };
    dialogConfig.width = "90%";
    const dialogRef = this.dialog.open(RestaurantPendingDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.loadNewRecurringOrders();
    });
  }
}
