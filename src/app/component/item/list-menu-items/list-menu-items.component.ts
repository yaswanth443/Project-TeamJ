import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, of, startWith, take } from 'rxjs';
import { AppConstants } from '../../../model/app-constants';
import { Item, ItemColumns, ItemColumnsForOrderMeal, ItemDetail, ItemForOrderMeal, ItemUnitLookup, RestaurantSearchDetails, RestaurantSearchDetailsArray } from '../../../model/item-details';
import { SharedService } from '../../../service/shared.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { DeliveryAddressDialogComponent } from '../../delivery-address-popup/delivery-address-popup.component';

@Component({
  selector: 'app-list-menu-items',
  templateUrl: './list-menu-items.component.html',
  styleUrls: ['./list-menu-items.component.scss']
})
export class ListMenuItemsComponent implements OnInit {

  @Input() customerName!: string;
  @Input() viewMode: boolean = false;
  displayedColumns: string[] = ItemColumnsForOrderMeal.map((col) => col.key);
  columnsSchema: any = ItemColumnsForOrderMeal;
  dataSource = new MatTableDataSource<ItemForOrderMeal>();
  valid: any = {};
  restaurantControl = new FormControl('');
  selectedUnit: RestaurantSearchDetails | undefined;
  itemOptions!: ItemDetail[];
  itemLookupUnits: ItemUnitLookup[] = [];
  filteredOptions!: Observable<ItemDetail[]>;
  filteredOptionUnits!: Observable<ItemUnitLookup[]>;
  previousAddOrEditExists: boolean = false;
  errorMessages: string = "";
  childItems!: ItemDetail[];
  selectedChildItem!: string[];
  deliveryAddress!: string;

  restaurantOptions: RestaurantSearchDetailsArray[] = new Array<RestaurantSearchDetailsArray>();

  displayFn(item: ItemDetail): string {
    return item && item.itemName ? item.itemName : '';
  }

  constructor(public dialogRef: MatDialogRef<ListMenuItemsComponent>,
    public dialog: MatDialog,
    private _sharedService: SharedService) {
  }

  ngOnInit() {
    this._sharedService.get(AppConstants.GET_OR_POST_DIET_CUST_ITEM.replace(
      '{customerName}', this.customerName)).subscribe((res: any[]) => {
        this.dataSource.data = res;
        res.forEach(data => {
          this._sharedService.get(AppConstants.GET_ITEMS_RESTAURANTS
            .replace("{parentItemName}", data.itemName)).subscribe((restaurantData: RestaurantSearchDetails[]) => {
              let values: RestaurantSearchDetailsArray = {
                restaurantDetails: restaurantData
              };
              this.restaurantOptions.push(values);
            })
        })
    });
  }

  inputHandler(e: any, itemName: string, key: string) {
    if (!this.valid[itemName]) {
      this.valid[itemName] = {}
    }
    this.valid[itemName][key] = e.target.validity.valid
  }

  disableSubmit(itemName: string) {
    if (this.valid[itemName]) {
      return Object.values(this.valid[itemName]).some((item) => item === false)
    }
    return false
  }

  isAllSelected() {
    if (this.dataSource.data.length == 0)
      return false;
    return this.dataSource.data.every((item) => item.isSelected)
  }

  isAnySelected() {
    return this.dataSource.data.some((item) => item.isSelected)
  }

  selectAll(event: any) {
    this.dataSource.data = this.dataSource.data.map((item) => ({
      ...item,
      isSelected: event.checked,
    }))
  }

  submit(customerUsername: string) {
    let errorsExists = false;
    this.dataSource.data.forEach(value => {
      if (!value.restaurant && value.restaurant == null) {
        this.errorMessages = "Kindly select the restaurant";
        errorsExists = true;
      }
      else if (!value.fromDate && value.fromDate == null) {
        this.errorMessages = "Required From date is required";
        errorsExists = true;
      }
      else if (!value.toDate && value.toDate == null) {
        this.errorMessages = "Required Till date is required";
        errorsExists = true;
      }
      else if (value.fromDate <= new Date()) {
        this.errorMessages = "Required From date cannot be equal or lesser than today";
        errorsExists = true;
      }
      else if (!value.deliveryTime && value.deliveryTime == null) {
        this.errorMessages = "Delivery time is required";
        errorsExists = true;
      }
    });
    if (errorsExists == false) {
      this.errorMessages = "";
      console.log("Element: " + JSON.stringify(this.dataSource.data));

      const params = new HttpParams()
        .set('customerUserName', customerUsername)
        .set('deliveryAddress', this.deliveryAddress);
      this._sharedService.postWithParams(AppConstants.CREATE_RECURRING_ORDER, this.dataSource.data, params).pipe(
        take(1)
      ).subscribe({
        next: (res) => {
          this._sharedService.displayMessage("Order created successfully with Order Id: " + res + ". Note: Orders will be delivered only post payment", "green-snackbar");
          this.close();
        },
        error: () => {
          this._sharedService.displayMessage("Error creating the order, kindly contact administrator", "blue-snackbar");
        }
      });
    }
  }

  addressConfirmationPopup(customerUsername: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "36%";
    this.dialog
      .open(DeliveryAddressDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((deliveryAddress) => {
        if (deliveryAddress) {
          this.deliveryAddress = deliveryAddress;
          this.submit(customerUsername);
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }

}
