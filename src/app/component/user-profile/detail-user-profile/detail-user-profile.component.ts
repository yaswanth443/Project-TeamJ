import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { AppConstants } from '../../../model/app-constants';
import { DietitianExperienceDetails, DietitianRecognitions, EducationDetails, LookupUnits, Rating, UserUpdateDetail } from '../../../model/user-detail';
import { AuthenticationService } from '../../../service/authentication.service';
import { SharedService } from '../../../service/shared.service';

@Component({
  selector: 'app-detail-user-profile',
  templateUrl: './detail-user-profile.component.html',
  styleUrls: ['./detail-user-profile.component.scss']
})
export class DetailUserProfileComponent implements OnInit {

  @Input() userName!: string;
  @Input() filter!: string;

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
  extraDegrees!: EducationDetails[];
  experienceDetails!: DietitianExperienceDetails[];
  recognitions!: DietitianRecognitions[];
  userProfileImage!: string;

  bio = '';
  address = '';
  selectedServicesCategories: Array<LookupUnits> = new Array<LookupUnits>();
  ratings!: Rating[];

  constructor(private _sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    if (!this.userName || this.userName == null) {
      let userName = this.route.snapshot.paramMap.get("userName");
      let filter = this.route.snapshot.paramMap.get("filter");
      if (userName != null && filter != null) {
        this.userName = userName;
        this.filter = filter;
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

    this.extraDegrees = userDetailValues.extraEducationDetails;
    this.recognitions = userDetailValues.recognitions;
    this.experienceDetails = userDetailValues.experienceDetails;
    this.userProfileImage = userDetailValues.userProfileImage;
  }

  navigateBack() {
    this.router.navigate(['/dieticians', { filter: this.filter }]);
  }
}
