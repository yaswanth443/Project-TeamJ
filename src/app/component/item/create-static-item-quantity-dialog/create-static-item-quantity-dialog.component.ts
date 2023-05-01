import {Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LookupUnits } from '../../../model/user-detail';

@Component({
  selector: 'app-create-static-item-quantity-dialog',
  templateUrl: './create-static-item-quantity-dialog.component.html',
  styleUrls: ['./create-static-item-quantity-dialog.component.scss']
})
export class CreateStaticItemQtyDialogComponent {
  selectedUnit!: LookupUnits;
  units!: LookupUnits[];
  headerString: string = 'Select your choice to add';
  actionButtonText: string = 'Add';
  quantity: number = 1;
  instructions!: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<CreateStaticItemQtyDialogComponent>) {
    this.units = data.units;
    this.selectedUnit = this.units[0];
    if (data.operation == 'remove') {
      this.headerString = 'Select your choice to remove';
      this.actionButtonText = 'Remove';
    }
  }

  save() {
    this.dialogRef.close({
      selectedUnit: this.selectedUnit,
      quantity: this.quantity,
      instructions: this.instructions
    });
  }
}
