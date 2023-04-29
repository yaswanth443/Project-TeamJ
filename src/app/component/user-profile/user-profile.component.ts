import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { AppConstants } from '../../model/app-constants';
import { LookupUnits, Rating, SubscriptionResponse, UserUpdateDetail } from '../../model/user-detail';
import { AuthenticationService } from '../../service/authentication.service';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  @Input() filter!: LookupUnits;
  @Input() dietitianDetails!: SubscriptionResponse;
  userName!: string;
  rating!: number;
  hiringStatus!: string;
  

  public updatesValid = true;
  public disableInputs = true;
  public username = '';
  public firstName = '';
  public lastName = '';
  public phoneNumber = '';
  public error = '';
  price = '';
  userTitle = '';
  overallExperience = '';
  specialistExperience = '';
  qualifiedDegree!: LookupUnits;
  degreeUniversity = '';
  degreeYear = '';
  bio = '';
  address = '';
  selectedServicesCategories: Array<LookupUnits> = new Array<LookupUnits>();
  ratings!: Rating[];
  userProfileImage!: string;
  @Output() hireEventEmitter = new EventEmitter<SubscriptionResponse>();
  private starCount: number = 5;
  ratingArr: Array<number> = [];
  certified!: string;
  userProfileActivated!: string;

  constructor(private _sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.userName = this.dietitianDetails.userName;
    this.rating = this.dietitianDetails.rating;
    this.hiringStatus = this.dietitianDetails.status.unitLookupCode;

    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
    if (!this.userName || this.userName == null) {
      let userName = this.route.snapshot.paramMap.get("userName");
      if (userName != null) {
        this.userName = userName;
      } else {
        this.router.navigateByUrl("/dashboard");
      }
    }

    this._sharedService.get(AppConstants.GET_USER_DETAILS.replace("{username}", this.userName)).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        this.assignFromUserDetail(res);
      },
      error: (err) => {
        console.log(err);
      }
    });
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

  assignFromUserDetail(userDetailValues: UserUpdateDetail) {
    this.firstName = userDetailValues.firstName;
    this.lastName = userDetailValues.lastName;
    this.username = userDetailValues.userName;
    this.phoneNumber = userDetailValues.phoneNumber;
    this.price = userDetailValues.price;
    this.userTitle = userDetailValues.title;
    this.overallExperience = userDetailValues.overallExperience;
    this.specialistExperience = userDetailValues.specialistExperience;
    this.qualifiedDegree = userDetailValues.qualifiedDegree;
    this.degreeUniversity = userDetailValues.degreeUniversity;
    this.degreeYear = userDetailValues.degreeYear;
    this.bio = userDetailValues.bio;
    this.address = userDetailValues.address;
    if (userDetailValues.services != null) {
      this.selectedServicesCategories = userDetailValues.services;
    }
    this.userProfileImage = userDetailValues.userProfileImage;
    this.certified = userDetailValues.certified;
    this.userProfileActivated = userDetailValues.userProfileActivated;
  }

  viewDetailProfile() {
    this.router.navigate(['/dieticians/profile', { userName: this.userName, filter: JSON.stringify(this.filter) }]);
  }

  hireDietitian() {
    this.hireEventEmitter.emit(this.dietitianDetails);
  }

  showIcon(index: number) {

    if (this.rating != null && this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
}
