import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConstants } from '../../model/app-constants';
import { SubscriptionResponse } from '../../model/user-detail';
import { SharedService } from '../../service/shared.service';
import { ListMenuItemsComponent } from '../item/list-menu-items/list-menu-items.component';

@Component({
  selector: 'app-recurring-order-dialog',
  templateUrl: './recurring-order-dialog.component.html',
  styleUrls: ['./recurring-order-dialog.component.scss']
})
export class RecurringOrdersDialogComponent implements OnInit {

  customer!: SubscriptionResponse;
  selectedValue!: string;
  messageCustomer: boolean = false;
  messageInput!: string;
  showItemTable: boolean = false;
  amount!: number;

  @ViewChild(ListMenuItemsComponent) child!: ListMenuItemsComponent;

  constructor(
    public dialogRef: MatDialogRef<RecurringOrdersDialogComponent>,
    private dietitianService: SharedService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.customer = data.customer;
  }

  ngOnInit() {
    this.messageCustomer = false;
  }

  message() {
    this.messageCustomer = true;
  }

  sendMessage() {
    this.customer.dietitianInput = this.messageInput;
    this.dietitianService.post(AppConstants.MSG_CUSTOMER, this.customer)
      .subscribe(
        (res: any) => {
          this.displayMessage('Message successfully sent', 'green-snackbar');
          this.close();
        },
        (err: any) => {
          this.displayMessage("Error occurred during service call. Error Details: " + JSON.stringify(err), 'blue-snackbar');
        });
  }

  prepareMeal() {
    this.showItemTable = true;
  }

  sendMeal() {
    this.customer.allergens = [];
    this.customer.dietitianInput = this.messageInput;
    this.customer.subscriptionAmount = this.amount;
    this.dietitianService.post(AppConstants.SEND_MEAL_DIET_TO_CUST, this.customer)
      .subscribe(
        (res: any) => {
          this.displayMessage('Meal successfully sent', 'green-snackbar');
          this.close();
        },
        (err: any) => {
          this.displayMessage("Error occurred during service call. Error Details: " + JSON.stringify(err), 'blue-snackbar');
        });
  }

  close(): void {
    this.dialogRef.close();
  }

  displayMessage(err: string, classname: string) {
    if (err === 'Unknown Error') {
      err = 'Error connecting to the services, kindly contact the administrator';
    }
    else if (err === 'OK') {
      err = 'Error submitting value, kindly contact the administrator';
    }
    this._snackBar.open(err, '', {
      duration: 2000,
      panelClass: [classname],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  viewMode(status: any) {
    if (status && (status.unitLookupCode === 'SUBSCRIPTION_STATUS_4' ||
      status.unitLookupCode === 'SUBSCRIPTION_STATUS_5'))
      return true;
    return false;
  }

  confirmOrder() {
    this.child.addressConfirmationPopup(this.customer.userName);
  }

}
