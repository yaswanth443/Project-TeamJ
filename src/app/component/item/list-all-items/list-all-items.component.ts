import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, of, startWith } from 'rxjs';
import { AppConstants } from '../../../model/app-constants';
import { Item, ItemColumns, ItemDetail, ItemUnitLookup } from '../../../model/item-details';
import { Menu, MenuItems } from '../../../model/user-detail';
import { SharedService } from '../../../service/shared.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { AddFromStaticDialogComponent } from '../add-from-static/add-from-static-dialog.component';

@Component({
  selector: 'app-list-all-items',
  templateUrl: './list-all-items.component.html',
  styleUrls: ['./list-all-items.component.scss']
})
export class ListAllItemsComponent implements OnInit {

  @Input() customerName!: string;
  @Input() viewMode: boolean = false;
  displayedColumns: string[] = ItemColumns.map((col) => col.key);
  columnsSchema: any = ItemColumns;
  dataSource = new MatTableDataSource<Item>();
  valid: any = {};
  itemControl = new FormControl('');
  selectedUnit: ItemUnitLookup | undefined;
  itemOptions!: ItemDetail[];
  itemLookupUnits: ItemUnitLookup[] = [];
  filteredOptions!: Observable<ItemDetail[]>;
  filteredOptionUnits!: Observable<ItemUnitLookup[]>;
  previousAddOrEditExists: boolean = false;
  previousAddOrEditExistsErrorMessage: string = "";
  childItems!: ItemDetail[];
  selectedChildItem!: string[];

  displayFn(item: ItemDetail): string {
    return item && item.itemName ? item.itemName : '';
  }

  selected(value: any) {
    /*let dropDownData = this.itemOptions.find(
      (data: any) => data.itemName === value
    );
    if (dropDownData) {
      this.itemLookupUnits = dropDownData.itemUnitsAndCodes;
    }*/
    this.itemLookupUnits = value.itemUnitsAndCodes;
    this.setChildItems(value);
  }

  private _filter(name: string): ItemDetail[] {
    const filterValue = name.toLowerCase();

    return this.itemOptions.filter(option => option.itemName.toLowerCase().includes(filterValue));
  }

  constructor(public dialog: MatDialog,
    private sharedService: SharedService) {
  }

  ngOnInit() {
    this.loadInitialItems();
  }

  loadInitialItems() {
    this.sharedService.get(AppConstants.GET_ALL_ITEMS).subscribe((res: any) => {
      //TODO: Assign to items list
      this.itemOptions = res;
      this.filteredOptions = this.itemControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.itemName;
          return name ? this._filter(name as string) : this.itemOptions.slice();
        }),
      );
      this.filteredOptionUnits = of(this.itemLookupUnits);
    });
    this.sharedService.get(AppConstants.GET_OR_POST_DIET_CUST_ITEM.replace(
      '{customerName}', this.customerName)).subscribe((res: any) => {
        this.dataSource.data = res;
      });
  }

  editCompletedRow(row: any) {
    if (row.itemName.itemName) {
      row.itemName = row.itemName.itemName;
    }
    this.sharedService.post(AppConstants.GET_OR_POST_DIET_CUST_ITEM.replace(
      '{customerName}', this.customerName), row).subscribe(
        (res) => {
          row.isEdit = false;
          row.isAdd = false;
          let jsonVal: Item = JSON.parse(res);
          row.itemName = jsonVal.itemName;
          row.quantityUnit = jsonVal.quantityUnit;
          this.previousAddOrEditExists = false;
          this.previousAddOrEditExistsErrorMessage = '';
          this.loadInitialItems();
        },
        (err) => {
          this.sharedService.displayMessage(err, 'red-snackbar');
        });
  }

  editRow(row: Item) {
    if (!this.previousAddOrEditExists) {
      row.isEdit = !row.isEdit;
      this.previousAddOrEditExists = true;
      this.itemControl.setValue(row.itemName);
      this.setItemLookups(row);
      this.setChildItems(row);
    }
    else {
      this.previousAddOrEditExistsErrorMessage = 'You cannot add/edit an item as there is already an existing one';
    }

  }

  setItemLookups(row: Item) {
    this.sharedService.get(AppConstants.GET_CUST_DIET_ITEM_LOOKUPS.replace(
      '{itemName}', row.itemName)).subscribe((res: any) => {
        this.itemLookupUnits = res;
        this.selectedUnit = this.itemLookupUnits.find(unit => unit.unitLookupValue == row.quantityUnit);
      });
  }

  setChildItems(row: any) {
    this.sharedService.get(AppConstants.GET_CHILD_ITEMS.replace(
      '{parentItemName}', row.itemName)).subscribe((res: any) => {
        this.childItems = res;
        let selectedUnits: string = row.childItems;
        if (selectedUnits) {
          this.selectedChildItem = this.childItems.filter(unit => 
            selectedUnits.indexOf(unit.itemName) != -1
          ).map(item => item.itemName);
        }
      });
  }

  addRow() {
    if (!this.previousAddOrEditExists) {
      const newRow: Item = {
        itemName: '',
        childItems: '',
        quantity: 1,
        quantityUnit: '',
        isEdit: true,
        isSelected: false,
        isAdd: true
      }
      this.dataSource.data = [newRow, ...this.dataSource.data];
      this.previousAddOrEditExists = true;
    } else {
      this.previousAddOrEditExistsErrorMessage = 'You cannot add/edit an item as there is already an existing one';
    }
  }

  addRowFromPreLoaded(selectedMenu: any) {
    this.sharedService.get(AppConstants.GET_DIETITIAN_MENU_ITEMS.replace(
      '{menuName}', selectedMenu))
      .subscribe((res: MenuItems[]) => {
        if (res) {
          res.forEach(menuItem => {
            let arr: string[] = new Array<string>();
            arr.push(menuItem.childItemName);

            const newRow = {
              itemName: menuItem.parentItemName,
              childItems: arr,
              quantity: menuItem.quantity,
              quantityUnit: menuItem.quantityUnit,
              instructions: menuItem.instructions,
              isEdit: false,
              isSelected: false,
              isAdd: false
            }
            this.editCompletedRow(newRow);
          });
        } else {
          this.sharedService.displayMessage('Error while loading items from menu, check if items exists in the menu', 'red-snackbar');
        }
      },
      (err: any) => {
          this.sharedService.displayMessage('Error while loading items from menu, check if items exists in the menu', 'red-snackbar');
      });
  }

  addFromSaved() {
    this.sharedService.get(AppConstants.GET_DIETITIAN_MENUS)
      .subscribe((res: Menu) => {
        if (res) {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.width = "20%";
          dialogConfig.data = {
            menus: res,
            operation: 'add'
          };
          const dialogRef = this.dialog.open(AddFromStaticDialogComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(result => {
            let selectedMenu = result.selectedMenu;
            this.addRowFromPreLoaded(selectedMenu);
          });
        } else {
          this.sharedService.displayMessage('No pre-loaded menus', 'red-snackbar');
        }
    })
  }

  removeRow(itemName: string) {
    const url = AppConstants.DELETE_DIET_CUST_ITEM.replace(
      '{customerName}', this.customerName).replace(
        '{itemName}', itemName);
    this.sharedService.put(url).subscribe((res) => {
      console.log("Data: "+res);
      this.dataSource.data = this.dataSource.data.filter(
        (u: Item) => u.itemName !== itemName,
      );
    })
  }

  removeSelectedRows() {
    const items = this.dataSource.data.filter((u: Item) => u.isSelected)
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          items.forEach(item => this.removeRow(item.itemName));
        }
      })
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

}
