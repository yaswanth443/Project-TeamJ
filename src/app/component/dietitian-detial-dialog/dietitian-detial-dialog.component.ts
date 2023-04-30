import { Component, Inject, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConstants } from '../../model/app-constants';
import { LookupUnits, SubscriptionResponse } from '../../model/user-detail';
import { SharedService } from '../../service/shared.service';
import { RateUserDialogComponent } from '../rate-user/rate-user.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-dietitian-detial-dialog',
  templateUrl: './dietitian-detial-dialog.component.html',
  styleUrls: ['./dietitian-detial-dialog.component.scss']
})
export class DietitianDetialDialogComponent implements OnInit {

  dietitian!: SubscriptionResponse;
  selectedValue!: string;
  preferredOptions!: LookupUnits[];
  preferredSelectedOption!: LookupUnits;
  customerInput!: string;
  addOnBlur = true;
  frequency!: string;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    public dialogRef: MatDialogRef<DietitianDetialDialogComponent>,
    private dietitianService: SharedService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.dietitian = data.dietitian;
    //this.dietitian.allergens = [];
  }

  ngOnInit() {
    this.loadPreferredMealOptions();
  }

  loadPreferredMealOptions() {
    this.dietitianService.get(AppConstants.GET_PREFERRED_OPTION_LOOKUPS.replace("{lookupTypeId}","4")).subscribe(
      (res: any) => {
        this.preferredOptions = res;
      },
      (err: any) => {
        this.displayMessage("Error Occurred while fetching preferred options: " + JSON.stringify(err), 'blue-snackbar');
      });
  }

  getChecked(option: LookupUnits) {
    if (option && this.dietitian.preferredMealOption) {
      return this.dietitian.preferredMealOption.unitLookupCode === option.unitLookupCode;
    }
    return false;
  }

  message() {
    this.dietitian.allergens = [];
    this.dietitian.customerInput = this.customerInput;
    this.dietitianService.post(AppConstants.MSG_DIETITIAN, this.dietitian)
      .subscribe(
        (res: any) => {
          this.displayMessage('Message sent successfully', 'green-snackbar');
          this.close();
        },
        (err: any) => {
          this.displayMessage("Error Occurred during service call. Error Details: "+JSON.stringify(err), 'blue-snackbar');
        });
  }

  submit() {
    //this.dietitian.allergens = [];
    this.dietitian.customerInput = this.customerInput;
    this.dietitianService.post(AppConstants.HIRE_DIETITIANS, this.dietitian)
      .subscribe(
        (res: any) => {
          this.displayMessage('You had succesfully hired a dietitian', 'green-snackbar');
          this.close();
        },
        (err: any) => {
          this.displayMessage("Error Occurred during service call. Error Details: " + JSON.stringify(err), 'blue-snackbar');
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

  confirmMenu() {
    this.dietitian.allergens = [];
    this.dietitianService.post(AppConstants.CUSTOMER_CONFIRM_MENU, this.dietitian)
      .subscribe(
        (res: any) => {
          this.displayMessage("You had succesfully confirmed the dietitian's Menu", 'green-snackbar');
          this.close();
        },
        (err: any) => {
          this.displayMessage("Error Occurred during service call. Error Details: " + JSON.stringify(err), 'blue-snackbar');
        });
  }

  rejectMenu() {
    this.dietitian.allergens = [];
    this.dietitianService.post(AppConstants.CUSTOMER_REJECT_MENU, this.dietitian)
      .subscribe(
        (res: any) => {
          this.displayMessage("You had succesfully rejected the dietitian's Menu", 'green-snackbar');
          this.close();
        },
        (err: any) => {
          this.displayMessage("Error Occurred during service call. Error Details: " + JSON.stringify(err), 'blue-snackbar');
        });
  }

  rateDietitian() {
    this.dietitian.allergens = [];
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      username: this.dietitian.userName
    };
    dialogConfig.width = "60%";
    const dialogRef = this.dialog.open(RateUserDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }


  //functions related to mat chip

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.dietitian.allergens.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(allergy: string): void {
    const index = this.dietitian.allergens.indexOf(allergy);

    if (index >= 0) {
      this.dietitian.allergens.splice(index, 1);
    }
  }

}
