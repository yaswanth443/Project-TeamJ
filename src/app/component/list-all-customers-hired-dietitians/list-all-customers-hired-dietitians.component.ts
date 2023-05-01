import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AppConstants } from '../../model/app-constants';
import { SubscriptionResponse } from '../../model/user-detail';
import { SharedService } from '../../service/shared.service';
import { CustomerDetialDialogComponent } from '../customer-detial-dialog/customer-detial-dialog.component';
import { DietitianDetialDialogComponent } from '../dietitian-detial-dialog/dietitian-detial-dialog.component';

@Component({
  selector: 'app-list-all-customers-hired-dietitians',
  templateUrl: './list-all-customers-hired-dietitians.component.html',
  styleUrls: ['./list-all-customers-hired-dietitians.component.scss']
})
export class ListAllCustomersHiredDietitiansComponent implements OnInit {

  constructor(private dieticianService: SharedService,
    public dialog: MatDialog) { }

  @ViewChild('paginator') paginator!: MatPaginator;
  dataSource!: MatTableDataSource<SubscriptionResponse>;
  displayedColumns: string[] = ['firstName', 'lastName', 'userName', 'phoneNumber', 'status', 'actions'];
  dataEmpty: boolean = false;
  error: boolean = true;

  ngOnInit(): void {
    this.loadDietitianData();
  }

  viewMenu(element: SubscriptionResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      dietitian: element
    };
    dialogConfig.width = "60%";
    const dialogRef = this.dialog.open(DietitianDetialDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      /*console.log('The dialog was closed');*/
      this.loadDietitianData();
    });
  }

  loadDietitianData() {
    this.dieticianService.get(AppConstants.CUSTOMER_HIRED_DIETITIANS).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;
        this.dataEmpty = res.empty;
        this.error = false;
      },
      error: (err) => {
        console.log("Error loading data: " + err);
        this.error = true;
      }
    });
  }

  refresh() {
    this.loadDietitianData();
  }

}
