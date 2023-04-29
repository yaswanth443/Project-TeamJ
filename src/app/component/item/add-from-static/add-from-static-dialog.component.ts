import {Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemWeightsAndPrices, Menu } from '../../../model/user-detail';

@Component({
  selector: 'app-add-from-static-dialog',
  templateUrl: './add-from-static-dialog.component.html',
  styleUrls: ['./add-from-static-dialog.component.scss']
})
export class AddFromStaticDialogComponent {
  selectedMenu!: string;
  menus!: Menu[];
  headerString: string = 'Select your choice to add';
  actionButtonText: string = 'Add';

  constructor(@Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<AddFromStaticDialogComponent>) {
    this.menus = data.menus;
    this.selectedMenu = this.menus[0].menuName;
  }

  save() {
    this.dialogRef.close({ selectedMenu: this.selectedMenu });
  }
}
