import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConstants } from '../../model/app-constants';
import { Rating } from '../../model/user-detail';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-view-rating',
  templateUrl: './view-rating.component.html',
  styleUrls: ['./view-rating.component.scss']
})
export class ViewRatingsDialogComponent implements OnInit{
  ratings!: Rating[];
  userName!: string;

  constructor(private _sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.userName = data.userName;
  }

  ngOnInit(): void {
    this._sharedService.get(AppConstants.GET_RATINGS_OF_USER.replace("{username}", this.userName))
      .subscribe(
        (res: any) => {
          this.ratings = res;
        },
        (err: any) => {
          console.log("Error while loading ratings service: " + err);
          this._sharedService.displayMessage("Error loading data, Kindly contact administrator", "blue-snackbar");
        });
  } 
}
