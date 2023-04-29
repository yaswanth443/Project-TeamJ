import {Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemWeightsAndPrices } from '../../../model/user-detail';

@Component({
  selector: 'app-restaurant-add-item-dialog',
  templateUrl: './restaurant-add-item-dialog.component.html',
  styleUrls: ['./restaurant-add-item-dialog.component.scss']
})
export class RestaurantAddItemDialogComponent {
  selectedWeight!: ItemWeightsAndPrices;
  itemWeightsAndPrices!: ItemWeightsAndPrices[];
  headerString: string = 'Select your choice to add';
  actionButtonText: string = 'Add';

  constructor(@Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<RestaurantAddItemDialogComponent>  ) {
    this.itemWeightsAndPrices = data.itemWeightsAndPrices;
    this.selectedWeight = this.itemWeightsAndPrices[0];
    if (data.operation == 'remove') {
      this.headerString = 'Select your choice to remove';
      this.actionButtonText = 'Remove';
    }
  }

  save() {
    this.dialogRef.close({ selectedWeight: this.selectedWeight });
  }
}
