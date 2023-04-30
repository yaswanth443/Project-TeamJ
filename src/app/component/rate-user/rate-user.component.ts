import {Component, Inject, Input, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConstants, LookupTypes } from '../../model/app-constants';
import { LookupUnits, Rating } from '../../model/user-detail';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-rate-user',
  templateUrl: './rate-user.component.html',
  styleUrls: ['./rate-user.component.scss']
})
export class RateUserDialogComponent implements OnInit {
  username!: string;
  rating!: Rating;
  ratingCategories!: LookupUnits[];
  commentOptions!: LookupUnits[];
  selectedCommentOptions: Array<LookupUnits> = new Array<LookupUnits>();
  recommended!: boolean;
  commentCategory: LookupUnits | undefined;
  displayError: boolean = false;
  comments!: string;
  ratingArr: Array<number> = [];
  ratingCount!: number;
  starCount: number = AppConstants.ratingStarTotalCount;

  constructor(private _sharedService: SharedService,
    public dialogRef: MatDialogRef<RateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.username = data.username;
    }

  ngOnInit(): void {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
    this._sharedService.get(AppConstants.GET_PREFERRED_OPTION_LOOKUPS.replace("{lookupTypeId}", LookupTypes.commentOptionsCategory))
      .subscribe(
        (res: any) => {
          this.commentOptions = res;
        },
        (err: any) => {
          console.log("Error while loading rating categories: " + err);
        });
    this._sharedService.get(AppConstants.GET_PREFERRED_OPTION_LOOKUPS.replace("{lookupTypeId}", LookupTypes.ratingCategory))
      .subscribe(
        (res: any) => {
          this.ratingCategories = res;
          this._sharedService.get(AppConstants.GET_SPECIFIC_RATINGS_OF_USER.replace("{username}", this.username))
            .subscribe(
              (res: any) => {
                if (res != null) {
                  this.rating = res;
                  this.recommended = this.rating.recommended;
                  this.commentCategory =
                    this.ratingCategories.find(cat => cat.unitLookupCode === this.rating.commentCategory.unitLookupCode);
                    ;
                  this.selectedCommentOptions = this.rating.commentOptions;
                  this.comments = this.rating.comments;
                  this.ratingCount = this.rating.rating;
                }
              },
              (err: any) => {
                console.log("Error while loading get ratings service: " + err);
              });
        },
        (err: any) => {
          console.log("Error while loading rating categories: " + err);
        });
  }

  isCommentOptionChecked(option: LookupUnits) {
    let checked = false;
    if (this.rating && this.rating.commentOptions) {
      this.rating.commentOptions.forEach(opt => {
        if (opt.unitLookupCode == option.unitLookupCode) {
          checked = true;
        }
      });
    }
    return checked;
  }

  updateCommentOptionChecked(option: LookupUnits, event: any) {
    if (event.checked) {
      this.selectedCommentOptions.push(option);
    } else {
      this.selectedCommentOptions.filter(opt => opt.unitLookupCode == option.unitLookupCode);
    }
  }

  submitReview() {
    if (this.recommended != undefined && this.commentCategory && this.selectedCommentOptions.length != 0 && this.comments && this.ratingCount) {
      this.displayError = false;
      this.rating = {
        username: this.username,
        recommended: this.recommended,
        commentCategory: this.commentCategory,
        commentOptions: this.selectedCommentOptions,
        comments: this.comments,
        rating: this.ratingCount,
        fullName: '' //not required as we are not using backend
      };
      this._sharedService.post(AppConstants.POST_RATINGS_OF_USER, this.rating)
        .subscribe(
          (res: any) => {
            this.dialogRef.close();
          },
          (err: any) => {
            console.log("Error while loading post ratings service: " + err);
            this._sharedService.displayMessage('Error occurred while submitting your rating', 'green-snackbar');
          });
    } else {
      this.displayError = true;
    }
  }

  onClick(rating: number) {
    this.ratingCount = rating;
    return false;
  }

  showIcon(index: number) {
    if (this.ratingCount >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
}
