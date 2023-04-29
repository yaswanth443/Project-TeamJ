import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AppConstants } from '../../model/app-constants';
import { SubscriptionResponse } from '../../model/user-detail';
import { SharedService } from '../../service/shared.service';
import { CustomerDetialDialogComponent } from '../customer-detial-dialog/customer-detial-dialog.component';
import { RecurringOrdersDialogComponent } from '../recurring-order-dialog/recurring-order-dialog.component';

@Component({
  selector: 'app-list-all-dietician-customers',
  templateUrl: './list-all-dietician-customers.component.html',
  styleUrls: ['./list-all-dietician-customers.component.scss']
})
export class ListAllDieticianCustomersComponent implements OnInit {

  constructor(private dieticianService: SharedService,
    public dialog: MatDialog) { }

  @ViewChild('paginator') paginator!: MatPaginator;
  dataSource!: MatTableDataSource<SubscriptionResponse>;
  displayedColumns: string[] = ['firstName', 'lastName', 'userName', 'phoneNumber', 'actions'];
  dataEmpty: boolean = false;

  ngOnInit(): void {
    this.loadNewCustomersData();
  }

  prepareMenu(element: SubscriptionResponse) {
    if (element.status.unitLookupCode === 'SUBSCRIPTION_STATUS_4') {
      this.openOrderFromRestaurantPopup(element);
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      customer: element
    };
    dialogConfig.width = "60%";
    const dialogRef = this.dialog.open(CustomerDetialDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      /*console.log('The dialog was closed');*/
      this.loadNewCustomersData();
    });
  }

  loadNewCustomersData() {
    this.dieticianService.get(AppConstants.GET_DIETITIAN_CUSTOMERS).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataEmpty = res.empty;
      },
      error: (err) => console.log("Error loading data: " + err)
    });
  }

  refresh() {
    this.loadNewCustomersData();
  }

  getActionText(statusCode: string) {
    if (statusCode === 'SUBSCRIPTION_STATUS_1')
      return 'Modify Menu';
    else if (statusCode === 'SUBSCRIPTION_STATUS_4')
      return 'Order Meal';
    return 'Prepare Menu';
  }

  openOrderFromRestaurantPopup(element: SubscriptionResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      customer: element
    };
    dialogConfig.width = "95%";
    const dialogRef = this.dialog.open(RecurringOrdersDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      /*console.log('The dialog was closed');*/
      this.loadNewCustomersData();
    });
  }

}
