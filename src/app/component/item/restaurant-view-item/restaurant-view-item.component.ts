import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { AppConstants } from '../../../model/app-constants';
import { ItemWeightsAndPrices, RestaurantChildItem, RestaurantItems } from '../../../model/user-detail';
import { SharedService } from '../../../service/shared.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { DeliveryAddressDialogComponent } from '../../delivery-address-popup/delivery-address-popup.component';
import { ViewRatingsDialogComponent } from '../../view-rating/view-rating.component';
import { RestaurantAddItemDialogComponent } from '../restaurant-add-item-dialog/restaurant-add-item-dialog.component';
import { RestaurantCreateItemComponent } from '../restaurant-create-item-dialog/restaurant-create-item.component';

@Component({
  selector: 'app-restaurant-view-item',
  templateUrl: './restaurant-view-item.component.html',
  styleUrls: ['./restaurant-view-item.component.scss']
})
export class RestaurantViewItemComponent implements OnInit {
  cartPanelOpenState = false;
  restaurantName!: string;//Input value that is recieved

  itemDetails!: RestaurantItems[];
  selectedWeight!: any;
  cartItems: any[] = new Array<any>();
  cartTotal: number = 0;
  deliveryAddress!: string;

  constructor(public _sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    if (!this._sharedService.isRestaurent()) {
      let restaurantName = this.route.snapshot.paramMap.get("restaurant");
      if (restaurantName != null) {
        this.restaurantName = restaurantName;
      } else {
        this.router.navigateByUrl("/dashboard");
      }
    }
    this.loadItems();
  }

  loadItems() {
    let url = this._sharedService.isRestaurent() ? AppConstants.GET_RESTAURANT_ITEMS_LOGGED :
      AppConstants.GET_RESTAURANT_ITEMS_NOT_LOG.replace("{restaurantUsername}", this.restaurantName);
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

  addItemToCart(parentItemName: string, childItem: RestaurantChildItem) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "18%";
    dialogConfig.data = {
      itemWeightsAndPrices: childItem.itemWeightsAndPrices,
      operation: 'add'
    };
    const dialogRef = this.dialog.open(RestaurantAddItemDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result.selectedWeight) {
        if (childItem.count)
          childItem.count = childItem.count + 1;
        else
          childItem.count = 1;
        let checkIfSameItemAlreadyPresent = this.cartItems.find(item => item.parentItemName == parentItemName
          && item.childItemName == childItem.itemName && item.itemWeightsAndPrices.quantity == result.selectedWeight.quantity
          && item.itemWeightsAndPrices.quantityUnit.unitLookupCode == result.selectedWeight.quantityUnit.unitLookupCode);
        if (checkIfSameItemAlreadyPresent) {
          checkIfSameItemAlreadyPresent.quantity = checkIfSameItemAlreadyPresent.quantity + 1;
          this.cartTotal = this.cartTotal + checkIfSameItemAlreadyPresent.itemWeightsAndPrices.itemPrice;
        } else {
          this.cartItems.push({
            parentItemName: parentItemName,
            childItemName: childItem.itemName,
            itemWeightsAndPrices: result.selectedWeight,
            quantity: 1
          });
          this.cartTotal = this.cartTotal + result.selectedWeight.itemPrice;
        }
      }
    });
  }

  removeItemFromCart(parentItemName: string, childItem: RestaurantChildItem) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "18%";
    dialogConfig.data = {
      itemWeightsAndPrices: childItem.itemWeightsAndPrices,
      operation: 'remove'
    };
    const dialogRef = this.dialog.open(RestaurantAddItemDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result.selectedWeight) {
        let checkIfSameItemAlreadyPresent = this.cartItems.find(item => item.parentItemName == parentItemName
          && item.childItemName == childItem.itemName && item.itemWeightsAndPrices.quantity == result.selectedWeight.quantity
          && item.itemWeightsAndPrices.quantityUnit.unitLookupCode == result.selectedWeight.quantityUnit.unitLookupCode);

        if (checkIfSameItemAlreadyPresent) {
          if (checkIfSameItemAlreadyPresent.quantity > 1) {
            checkIfSameItemAlreadyPresent.quantity = checkIfSameItemAlreadyPresent.quantity - 1;
            childItem.count = childItem.count - 1;
            this.cartTotal = this.cartTotal - checkIfSameItemAlreadyPresent.itemWeightsAndPrices.itemPrice;
          } else {
            this.cartItems.filter(val => {
              if (!(val.parentItemName == parentItemName && val.childItemName ==
                childItem.itemName && val.itemWeightsAndPrices.quantity == result.selectedWeight.quantity
                && val.itemWeightsAndPrices.quantityUnit.unitLookupCode == result.selectedWeight.quantityUnit.unitLookupCode)) {
                childItem.count = childItem.count - 1;
                this.cartTotal = this.cartTotal - result.selectedWeight.itemPrice;
                return true;
              }
              return false;
            });
          }
        }
      }
    });
  }

  addNewItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "60%";
    const dialogRef = this.dialog.open(RestaurantCreateItemComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.loadItems();
    });
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
    const params = new HttpParams()
      .set('restaurantUserName', this.restaurantName)
      .set('deliveryAddress', this.deliveryAddress);
    this._sharedService.postWithParams(AppConstants.CREATE_GET_ORDER, this.cartItems, params).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        this.placeOrderConfirmationPopup(res);
        this.clearItemsInCart();
      },
      error: () => {
        this._sharedService.displayMessage("Error loading the menu, kindly contact administrator", "red-snackbar");
      }
    });
  }

  placeOrderConfirmationPopup(res: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "36%";
    dialogConfig.data = {
      popupTitle: 'Order with order number ' + JSON.parse(res).orderId + ' placed successfully.',
      showCancel: false,
      actionText: 'Close'
    };
    this.dialog
      .open(ConfirmDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => { });
  }

  addressConfirmationPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "36%";
    this.dialog
      .open(DeliveryAddressDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((deliveryAddress) => {
        if (deliveryAddress) {
          this.deliveryAddress = deliveryAddress;
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
