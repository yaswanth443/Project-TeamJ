import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { AppConstants } from '../../../model/app-constants';
import { ItemWeightsAndPrices, ParentAndChildItems, RestaurantChildItem, RestaurantItems } from '../../../model/user-detail';
import { SharedService } from '../../../service/shared.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { DeliveryAddressDialogComponent } from '../../delivery-address-popup/delivery-address-popup.component';
import { ViewRatingsDialogComponent } from '../../view-rating/view-rating.component';
import { CreateNewItemDialogComponent } from '../create-new-item/create-new-item.component';
import { CreateStaticItemQtyDialogComponent } from '../create-static-item-quantity-dialog/create-static-item-quantity-dialog.component';
import { RestaurantAddItemDialogComponent } from '../restaurant-add-item-dialog/restaurant-add-item-dialog.component';
import { RestaurantCreateItemComponent } from '../restaurant-create-item-dialog/restaurant-create-item.component';

@Component({
  selector: 'app-create-static-menu',
  templateUrl: './create-static-menu.component.html',
  styleUrls: ['./create-static-menu.component.scss']
})
export class CreateStaticMenuComponent implements OnInit {
  cartPanelOpenState = false;
  restaurantName!: string;//Input value that is recieved

  itemDetails!: ParentAndChildItems[];
  selectedWeight!: any;
  cartItems: any[] = new Array<any>();
  cartTotal: number = 0;
  menuName!: string;

  constructor(public _sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    let url = AppConstants.GET_ALL_ITEMS_LIST;
    this._sharedService.get(url).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        this.itemDetails = res;
      },
      error: () => {
        this._sharedService.displayMessage("Error loading the menu, kindly contact administrator", "red-snackbar");
      }
    });
  }

  addNewItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "60%";
    const dialogRef = this.dialog.open(CreateNewItemDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.loadItems();
    });
  }

  addItemToCart(parentItemName: string, childItem: ParentAndChildItems) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "36%";
    dialogConfig.data = {
      units: childItem.itemUnitsAndCodes
    };
    this.dialog
      .open(CreateStaticItemQtyDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((result) => {

        if (childItem.count)
          childItem.count = childItem.count + 1;
        else
          childItem.count = 1;

        let checkIfSameItemAlreadyPresent = this.cartItems.find(item =>
          item.parentItemName == parentItemName
          && item.childItemName == childItem.itemName
          && item.quantityUnit == result.selectedUnit);
        if (checkIfSameItemAlreadyPresent) {
          checkIfSameItemAlreadyPresent.quantity = result.quantity;
        } else {
          this.cartItems.push({
            parentItemName: parentItemName,
            childItemName: childItem.itemName,
            quantity: result.quantity,
            quantityUnit: result.selectedUnit,
            instructions: result.instructions
          });
        }
      });    
  }

  removeItemFromCart(parentItemName: string, childItem: ParentAndChildItems) {
    if (childItem.count)
      childItem.count = childItem.count - 1;
    else
      childItem.count = 0;

    let checkIfSameItemAlreadyPresent = this.cartItems.find(item =>
      item.parentItemName == parentItemName && item.childItemName == childItem.itemName);
    if (checkIfSameItemAlreadyPresent) {
      if (checkIfSameItemAlreadyPresent.quantity == 0) {
        this.cartItems.filter(item =>
          !(item.parentItemName == parentItemName && item.childItemName == childItem.itemName)
        );
      } else {
        checkIfSameItemAlreadyPresent.quantity = checkIfSameItemAlreadyPresent.quantity - 1;
      }
    }
  }

  viewCart() {
    this.cartPanelOpenState = true; //open card
    //close remaining all expansion panels
    this.itemDetails.forEach(parentItem => parentItem.panelOpenState = false);
  }

  clearCart() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "36%";
    dialogConfig.data = {
      popupTitle: 'Are you sure you want to clear the cart?'
    };
    this.dialog
      .open(ConfirmDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.clearItemsInCart();
          this._sharedService.displayMessage("Cart cleared", "green-snackbar");
        }
      });
  }

  clearItemsInCart() {
    this.cartItems.length = 0;
    this.itemDetails.forEach(parentItem => parentItem.childItems.forEach(childItem =>
      childItem.count = 0));
  }

  createOrder() {
    this._sharedService.post(AppConstants.SAVE_DIETITIAN_MENU.replace('{menuName}', this.menuName), this.cartItems).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        this.placeOrderConfirmationPopup(res);
        this.clearItemsInCart();
      },
      error: (err) => {
        this._sharedService.displayMessage(JSON.parse(err.error).message, "red-snackbar");
      }
    });
  }

  placeOrderConfirmationPopup(res: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "36%";
    dialogConfig.data = {
      popupTitle: 'Menu saved successfully.',
      showCancel: false,
      actionText: 'Close'
    };
    this.dialog
      .open(ConfirmDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => { });
  }

  saveConfirmationPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "36%";
    dialogConfig.data = {
      titleText: 'Menu name',
      placeholderText: 'Input unique name for saving the menu'
    };
    this.dialog
      .open(DeliveryAddressDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((menuName) => {
        if (menuName) {
          this.menuName = menuName;
          this.createOrder();
        }
      });
  }

  viewRatings() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "36%";
    dialogConfig.data = {
      userName: this.restaurantName
    };
    this.dialog
      .open(ViewRatingsDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((confirm) => {
      });
  }
}
