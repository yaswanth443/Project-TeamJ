import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AppConstants } from '../../model/app-constants';
import { Orders } from '../../model/order-details';
import { SharedService } from '../../service/shared.service';
import { CustomerOrderLiveDialogComponent } from './customer-live-dialog/customer-live-dialog.component';

@Component({
  selector: 'app-customer-restaurant-orders',
  templateUrl: './customer-restaurant-orders.component.html',
  styleUrls: ['./customer-restaurant-orders.component.scss']
})
export class CustomerRestaurantOrdersComponent implements OnInit {

  dataSource!: MatTableDataSource<Orders>;
  @ViewChild('paginator') paginator!: MatPaginator;
  displayedColumns: string[] = ['orderId', 'restaurantName', 'deliveryAddress', 'orderStatus', 'actions'];

  constructor(private sharedService: SharedService,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadRestaurantDeliverableOrders();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadRestaurantDeliverableOrders() {
    this.sharedService.get(AppConstants.CREATE_GET_ORDER).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.dataSource = new MatTableDataSource(res);
          this.ref.detectChanges();
          this.dataSource.paginator = this.paginator;
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
    const dialogRef = this.dialog.open(CustomerOrderLiveDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.loadRestaurantDeliverableOrders();
    });
  }

}
