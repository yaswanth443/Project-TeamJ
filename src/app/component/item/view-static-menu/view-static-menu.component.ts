import { Component, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, of, startWith } from 'rxjs';
import { AppConstants } from '../../../model/app-constants';
import { Item, ItemColumns, ItemDetail, ItemUnitLookup, MenuItemColumns } from '../../../model/item-details';
import { LookupUnits, MenuItems, ParentAndChildItems } from '../../../model/user-detail';
import { SharedService } from '../../../service/shared.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-view-static-menu',
  templateUrl: './view-static-menu.component.html',
  styleUrls: ['./view-static-menu.component.scss']
})
export class ViewStaticItemsComponent implements OnInit {

  @Input() customerName!: string;
  @Input() viewMode: boolean = false;
  displayedColumns: string[] = MenuItemColumns.map((col) => col.key);
  columnsSchema: any = MenuItemColumns;
  dataSource = new MatTableDataSource<MenuItems>();
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
  menuName!: string;

  displayFn(item: ItemDetail): string {
    return item && item.itemName ? item.itemName : '';
  }

  selected(value: any) {
    this.itemLookupUnits = value.itemUnitsAndCodes;
    this.setChildItems(value);
  }

  private _filter(name: string): ItemDetail[] {
    const filterValue = name.toLowerCase();

    return this.itemOptions.filter(option => option.itemName.toLowerCase().includes(filterValue));
  }

  constructor(public dialogRef: MatDialogRef<ViewStaticItemsComponent>,
    public dialog: MatDialog,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.menuName = data.menuName;
  }

  ngOnInit() {
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
    this.sharedService.get(AppConstants.GET_DIETITIAN_MENU_ITEMS.replace('{menuName}', this.menuName)).subscribe((res: any) => {
        this.dataSource.data = res;
    });
  }

  editCompletedRow(row: any) {
    if (!row.childItemName || row.childItemName == null) {
      this.sharedService.displayMessage("Item is required", 'red-snackbar');
    }
    row.isEdit = false;
    row.isAdd = false;
    row.parentItemName = row.parentItemName.itemName;
    this.previousAddOrEditExists = false;
    this.previousAddOrEditExistsErrorMessage = '';
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

  save() {
    this.sharedService.post(AppConstants.MODIFY_DIETITIAN_MENU.replace(
      '{menuName}', this.menuName), this.dataSource.data).subscribe((res: any) => {
        this.dialogRef.close();
        this.sharedService.displayMessage("Menu modified successfully", "green-snackbar");
      },
        (err: any) => {
          this.sharedService.displayMessage("Error occurred while modifying menu", "red-snackbar");
        });
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
      let lookupUnit: LookupUnits = {
        unitLookupCode: '',
        unitLookupValue: ''
      };
      const newRow: MenuItems = {
        parentItemName: '',
        childItemName: '',
        quantity: 1,
        quantityUnit: lookupUnit,
        instructions: '',
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

  removeRow(item: MenuItems) {
    this.dataSource.data = this.dataSource.data.filter(
      (u: MenuItems) => u.parentItemName !== item.parentItemName
        && u.childItemName !== item.childItemName,
    );
  }

  removeSelectedRows() {
    const items = this.dataSource.data.filter((u: MenuItems) => u.isSelected)
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          items.forEach(item => this.removeRow(item));
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
