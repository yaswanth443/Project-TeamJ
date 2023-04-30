import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delivery-address-popup',
  templateUrl: './delivery-address-popup.component.html',
  styleUrls: ['./delivery-address-popup.component.scss']
})
export class DeliveryAddressDialogComponent {
  address!: string;
  titleText!: string;
  placeholderText!: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    if (data && data.titleText && data.titleText!=null) {
      this.titleText = data.titleText;
      this.placeholderText = data.placeholderText;
    }
  }
}
