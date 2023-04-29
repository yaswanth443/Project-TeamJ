import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AppConstants } from '../../model/app-constants';
import { DietitianRecurringOrderDetails } from '../../model/order-details';
import { SharedService } from '../../service/shared.service';
import { RestaurantLiveDialogComponent } from '../restaurant-dashboard-live/restaurant-dashboard-live-dialog/restaurant-dashboard-live-dialog.component';
import { DietitianRecurringDialogComponent } from './dietitian-dashboard-recurring-dialog/dietitian-dashboard-recurring-dialog.component';

@Component({
  selector: 'app-dietitian-restaurant-orders-dashboard',
  templateUrl: './dietitian-restaurant-orders-dashboard.component.html',
  styleUrls: ['./dietitian-restaurant-orders-dashboard.component.scss']
})
export class DietitianRestaurantOrdersDashboardComponent implements OnInit {

  dataExists: boolean = false;
  dataSource!: MatTableDataSource<DietitianRecurringOrderDetails>;
  displayedColumns: string[] = ['orderId', 'customerName', 'customerUsername', 'orderStatus', 'actions'];

  constructor(private sharedService: SharedService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadNewRecurringOrders();
  }

  loadNewRecurringOrders() {
    this.sharedService.get(AppConstants.GET_RECURRING_ORDER_BY_DIET).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        if (res && res != null && res != '') {
          this.dataExists = true;
          this.dataSource = new MatTableDataSource(res);
        } else {
          this.dataExists = false;
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
    const dialogRef = this.dialog.open(DietitianRecurringDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.loadNewRecurringOrders();
    });
  }

}
