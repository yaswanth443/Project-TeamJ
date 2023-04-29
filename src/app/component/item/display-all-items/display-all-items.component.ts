import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, of, startWith } from 'rxjs';
import { AppConstants } from '../../../model/app-constants';
import { Item, ItemColumns, ItemDetail, ItemUnitLookup } from '../../../model/item-details';
import { SharedService } from '../../../service/shared.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-display-all-items',
  templateUrl: './display-all-items.component.html',
  styleUrls: ['./display-all-items.component.scss']
})
export class DisplayAllItemsComponent implements OnInit {

  @Input() customerName!: string;
  @Input() dietitianName!: string;
  displayedColumns: string[] = ItemColumns.map((col) => col.key);
  columnsSchema: any = ItemColumns;
  dataSource = new MatTableDataSource<Item>();
  dataExists: boolean = false;

  constructor(public dialog: MatDialog,
    private sharedService: SharedService) {
  }

  ngOnInit() {
    if (this.customerName && this.customerName != '') {
      this.sharedService.get(AppConstants.GET_OR_POST_DIET_CUST_ITEM.replace(
        '{customerName}', this.customerName)).subscribe((res: any) => {
          this.dataSource.data = res;
          this.dataExists = true;
        });
    } else if (this.dietitianName && this.dietitianName != '') {
      this.sharedService.get(AppConstants.GET_CUST_DIET_ITEM.replace(
        '{dietitianName}', this.dietitianName)).subscribe((res: any) => {
          this.dataSource.data = res;
          this.dataExists = true;
        });
    }
  }

}
