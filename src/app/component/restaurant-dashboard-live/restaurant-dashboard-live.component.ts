import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AppConstants } from '../../model/app-constants';
import { Orders } from '../../model/order-details';
import { SharedService } from '../../service/shared.service';
import { RestaurantLiveDialogComponent } from './restaurant-dashboard-live-dialog/restaurant-dashboard-live-dialog.component';

@Component({
  selector: 'app-restaurant-dashboard-live',
  templateUrl: './restaurant-dashboard-live.component.html',
  styleUrls: ['./restaurant-dashboard-live.component.scss']
})
export class RestaurantDashboardLiveComponent implements OnInit {

  dataSource!: MatTableDataSource<Orders>;
  displayedColumns: string[] = ['orderId', 'customerName', 'deliveryAddress', 'orderStatus', 'actions'];

  constructor(private sharedService: SharedService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadRestaurantDeliverableOrders();
  }

  loadRestaurantDeliverableOrders() {
    this.sharedService.get(AppConstants.RESTAURANT_LIVE_ORDERS).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
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
    const dialogRef = this.dialog.open(RestaurantLiveDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.loadRestaurantDeliverableOrders();
    });
  }
  
}
