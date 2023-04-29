import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { AppConstants } from '../../../model/app-constants';
import { ItemDetail, ItemUnitLookup } from '../../../model/item-details';
import { SharedService } from '../../../service/shared.service';

@Component({
  selector: 'app-create-new-item',
  templateUrl: './create-new-item.component.html',
  styleUrls: ['./create-new-item.component.scss']
})
export class CreateNewItemDialogComponent implements OnInit {

  itemOptions!: ItemDetail[];
  filteredParentItems!: Observable<ItemDetail[]>;
  itemLookupUnits: ItemUnitLookup[] = [];
  childItems!: ItemDetail[];

  imageSrc: string = '';
  myForm = new FormGroup({
    parentItemName: new FormControl('', [Validators.required]),
    itemName: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required]),
    quantityUnit: new FormControl('', [Validators.required]),
    itemPrice: new FormControl('', [Validators.required]),
    itemDescription: new FormControl('', [Validators.required]),
    isActive: new FormControl('', [Validators.required]), //Item available or not 
    file: new FormControl('', [Validators.required]),
    itemImage: new FormControl('', [Validators.required])
  });

  constructor(private _sharedService: SharedService,
    public dialogRef: MatDialogRef<CreateNewItemDialogComponent>) {
  }

  ngOnInit(): void {
    this._sharedService.get(AppConstants.GET_ALL_ITEMS).subscribe((res: any) => {
      //TODO: Assign to items list
      this.itemOptions = res;
      this.filteredParentItems = this.myForm.controls.parentItemName.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.itemName;
          return name ? this._filter(name as string) : this.itemOptions.slice();
        }),
      );
    });
  }

  setChildItems(parentItemName: any) {
    this._sharedService.get(AppConstants.GET_CHILD_ITEMS.replace(
      '{parentItemName}', parentItemName)).subscribe((res: any) => {
        this.childItems = res;
      });
  } 

  private _filter(name: string): ItemDetail[] {
    const filterValue = name.toLowerCase();

    return this.itemOptions.filter(option => option.itemName.toLowerCase().includes(filterValue));
  }

  displayFn(item: ItemDetail): string {
    return item && item.itemName ? item.itemName : '';
  }

  get f() {
    return this.myForm.controls;
  }

  selected(value: any) {
    this.itemLookupUnits = value.itemUnitsAndCodes;
    this.setChildItems(value.itemName);
  }

  onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {

        this.imageSrc = reader.result as string;
        console.log("Image -> " + this.imageSrc);

        this.myForm.patchValue({
          itemImage: reader.result as string
        });

      };

    }
  }

  submit() {
    this.myForm.patchValue({
      parentItemName: this.myForm.controls['parentItemName'].value.itemName
    });
    console.log(this.myForm.value);
    this._sharedService.post(AppConstants.CREATE_ITEM, this.myForm.value)
      .subscribe(res => {
        this._sharedService.displayMessage("Item created successfully", "green-snackbar");
        this.close();
      })
  }

  close(): void {
    this.dialogRef.close();
  }

}
