import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AppConstants } from '../../model/app-constants';
import { Orders } from '../../model/order-details';
import { SharedService } from '../../service/shared.service';
import { CustomerLiveDialogComponent } from './customer-dashboard-live-dialog/customer-dashboard-live-dialog.component';

@Component({
  selector: 'app-customer-restaurant-orders-dashboard',
  templateUrl: './customer-restaurant-orders-dashboard.component.html',
  styleUrls: ['./customer-restaurant-orders-dashboard.component.scss']
})
export class CustomerRestaurantOrdersDashboardComponent implements OnInit {

  dataSource!: MatTableDataSource<Orders>;
  displayedColumns: string[] = ['orderId', 'restaurantName', 'deliveryAddress', 'orderStatus', 'actions'];

  constructor(private sharedService: SharedService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadRestaurantDeliverableOrders();
  }

  loadRestaurantDeliverableOrders() {
    this.sharedService.get(AppConstants.GET_ORDER).pipe(
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

  openDialog(element: Orders) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      element: element
    };
    dialogConfig.width = "90%";
    const dialogRef = this.dialog.open(CustomerLiveDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.loadRestaurantDeliverableOrders();
    });
  }

}
