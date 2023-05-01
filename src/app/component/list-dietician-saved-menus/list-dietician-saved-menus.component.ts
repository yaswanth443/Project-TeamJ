import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AppConstants } from '../../model/app-constants';
import { Menu } from '../../model/user-detail';
import { SharedService } from '../../service/shared.service';
import { DietitianDetialDialogComponent } from '../dietitian-detial-dialog/dietitian-detial-dialog.component';
import { ViewStaticItemsComponent } from '../item/view-static-menu/view-static-menu.component';

@Component({
  selector: 'app-list-dietician-saved-menus',
  templateUrl: './list-dietician-saved-menus.component.html',
  styleUrls: ['./list-dietician-saved-menus.component.scss']
})
export class ListDieticianSaveMenusComponent implements OnInit {

  constructor(private sharedService: SharedService,
    private _router: Router,
    public dialog: MatDialog) { }

  @ViewChild('paginator') paginator!: MatPaginator;
  dataSource!: MatTableDataSource<Menu>;
  displayedColumns: string[] = ['menuName', 'createdOrModifiedDate', 'actions'];
  

  ngOnInit(): void {
    this.loadDietitianMenus();
  }

  loadDietitianMenus() {
    this.sharedService.get(AppConstants.GET_DIETITIAN_MENUS).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => console.log("Error loading data: " + err)
    });
  }

  viewItems(element: Menu) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      menuName: element.menuName
    };
    dialogConfig.width = "60%";
    const dialogRef = this.dialog.open(ViewStaticItemsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.loadDietitianMenus();
    });
  }

}
