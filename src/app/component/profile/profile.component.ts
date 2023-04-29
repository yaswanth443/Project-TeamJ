import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AppConstants, LookupTypes } from '../../model/app-constants';
import { LookupUnits, EducationDetails, UserUpdateDetail, DietitianExperienceDetails, DietitianRecognitions } from '../../model/user-detail';
import { AuthenticationService } from '../../service/authentication.service';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

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

  bio = '';
  address = '';
  avgCost = '';
  restaurantName = '';
  public userDetail!: {} ;
  degreeCategories!: LookupUnits[];


  servicesCategory!: LookupUnits[];
  selectedServicesCategories: Array<LookupUnits> = new Array<LookupUnits>();
  cuisinesCategory!: LookupUnits[];
  selectedCuisinesCategories: Array<LookupUnits> = new Array<LookupUnits>();
  imageSrc: string = '';

  constructor(private _authService: AuthenticationService,
    private _router: Router,
    public _sharedService: SharedService) { }

  ngOnInit(): void {
    this._sharedService.get(AppConstants.GET_PREFERRED_OPTION_LOOKUPS.replace("{lookupTypeId}", LookupTypes.degreeCategory))
      .subscribe(
        (res: any) => {
          this.degreeCategories = res;
        },
        (err: any) => {
          console.log("Error while loading get ratings service: " + err);
        });
    this._sharedService.get(AppConstants.GET_PREFERRED_OPTION_LOOKUPS.replace("{lookupTypeId}", LookupTypes.servicesCategory))
      .subscribe(
        (res: any) => {
          this.servicesCategory = res;
        },
        (err: any) => {
          console.log("Error while loading get services service: " + err);
        });
    this._sharedService.get(AppConstants.GET_PREFERRED_OPTION_LOOKUPS.replace("{lookupTypeId}", LookupTypes.cuisinesCategory))
        .subscribe(
          (res: any) => {
            this.cuisinesCategory = res;
          },
          (err: any) => {
            console.log("Error while loading get cuisines service: " + err);
          });
    this.loadInitialDetails();
    
  }

  loadInitialDetails() {
    this._authService.getLoggedUserDetails().pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        this.disableInputs = true;
        this.experienceDetails = [];
        this.recognitions = [];
        this.extraDegrees = [];
        this.updatesValid = true;
        this.assignFromUserDetail(res);
      },
      error: (err) => {
        this.updatesValid = false;
        this.error = err;
      }
    });
  }

  public onSubmit(): void {
    this.updatesValid = true;
    this.userDetail = {
      firstName: this.firstName,
      lastName: this.lastName,
      userName: this.username,
      phoneNumber: this.phoneNumber,
      password: '',
      userType: '',
      price: this.price,
      title: this.userTitle,
      overallExperience: this.overallExperience,
      specialistExperience: this.specialistExperience,
      qualifiedDegree: this.qualifiedDegree,
      degreeUniversity: this.degreeUniversity,
      degreeYear: this.degreeYear,
      bio: this.bio,
      address: this.address,
      services: this.selectedServicesCategories,
      cuisines: this.selectedCuisinesCategories,
      avgCost: this.avgCost,
      restaurantName: this.restaurantName,
      restaurantImage: this.imageSrc,
      userProfileImage: '',
      certified: 'N',
      userProfileActivated: 'Y',
      extraEducationDetails: this.extraDegrees,
      recognitions: this.recognitions,
      experienceDetails: this.experienceDetails
    };

    this._authService.postJson(this.userDetail, AppConstants.PUT_USER_DETAILS).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        this.updatesValid = true;
        //this.assignFromUserDetail(res);
        this.disableInputs = true;
        localStorage.setItem('userProfileActivated', res.userProfileActivated);
      },
      error: (err) => {
        this.updatesValid = false;
        this.error = err;
      }
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

    if (this.degreeCategories && userDetailValues.qualifiedDegree) {
      let category = this.degreeCategories.find(lookup =>
        lookup.unitLookupCode == userDetailValues.qualifiedDegree.unitLookupCode);
      if (category)
        this.qualifiedDegree = category;
    }
    this.degreeUniversity = userDetailValues.degreeUniversity;
    this.degreeYear = userDetailValues.degreeYear;
    if (userDetailValues.extraEducationDetails
      && userDetailValues.extraEducationDetails != null
      && userDetailValues.extraEducationDetails.length > 0) {
      userDetailValues.extraEducationDetails.forEach(degree => {
        this.addValuesToExtraDegrees(degree);
      });
    }

    this.recognitions = userDetailValues.recognitions;
    this.experienceDetails = userDetailValues.experienceDetails;

    this.bio = userDetailValues.bio;
    this.address = userDetailValues.address;

    if (userDetailValues.services != null) {
      this.selectedServicesCategories = this.servicesCategory.filter(service1 =>
        userDetailValues.services.find(service2 => service1.unitLookupCode === service2.unitLookupCode));
    }
    if (userDetailValues.cuisines != null) {
      this.selectedCuisinesCategories = this.cuisinesCategory.filter(cuisine1 =>
        userDetailValues.cuisines.find(cuisine2 => cuisine1.unitLookupCode === cuisine2.unitLookupCode));
    }
    this.avgCost = userDetailValues.avgCost;
    this.restaurantName = userDetailValues.restaurantName;
    this.imageSrc = userDetailValues.restaurantImage;
    if (!this.imageSrc)
      this.imageSrc = userDetailValues.userProfileImage;
  }

  addValuesToExtraDegrees(degree: EducationDetails) {
    if (this.degreeCategories && degree.qualifiedDegree) {
      let category = this.degreeCategories.find(lookup =>
        lookup.unitLookupCode == degree.qualifiedDegree.unitLookupCode);
      if (category) {
        const newDegree: EducationDetails = {
          qualifiedDegree: category,
          degreeUniversity: degree.degreeUniversity,
          degreeYear: degree.degreeYear
        }
        if (this.extraDegrees && this.extraDegrees != null && this.extraDegrees.length > 0)
          this.extraDegrees.push(newDegree);
        else
          this.extraDegrees = [newDegree];
      }
    }
  }

  editClick() {
    this.disableInputs = false;
  }

  isServiceOptionChecked(option: LookupUnits) {
    let checked = false;
    if (this.selectedServicesCategories && this.selectedServicesCategories.length != 0) {
      this.selectedServicesCategories.forEach(opt => {
        if (opt.unitLookupCode == option.unitLookupCode) {
          checked = true;
        }
      });
    }
    return checked;
  }

  updateServiceOptionChecked(option: LookupUnits, event: any) {
    if (event.checked) {
      this.selectedServicesCategories.push(option);
    } else {
      this.selectedServicesCategories.filter(opt => opt.unitLookupCode == option.unitLookupCode);
    }
  }

  isCuisineOptionChecked(option: LookupUnits) {
    let checked = false;
    if (this.selectedCuisinesCategories && this.selectedCuisinesCategories.length != 0) {
      this.selectedCuisinesCategories.forEach(opt => {
        if (opt.unitLookupCode == option.unitLookupCode) {
          checked = true;
        }
      });
    }
    return checked;
  }

  updateCuisineOptionChecked(option: LookupUnits, event: any) {
    if (event.checked) {
      this.selectedCuisinesCategories.push(option);
    } else {
      this.selectedCuisinesCategories.filter(opt => opt.unitLookupCode == option.unitLookupCode);
    }
  }

  degreeChange(option1: any) {
    this.qualifiedDegree = option1.value;
  }

  extraDegreeChange(option1: any, education: EducationDetails) {
    education.qualifiedDegree = option1.value;
  }

  addExtraDegrees() {
    const newDegree: EducationDetails = {
      qualifiedDegree: {
        unitLookupCode: '',
        unitLookupValue: ''
      },
      degreeUniversity: '',
      degreeYear: ''
    }
    if (this.extraDegrees && this.extraDegrees != null && this.extraDegrees.length > 0)
      this.extraDegrees.push(newDegree);
    else
      this.extraDegrees = [newDegree];
  }

  addRecognitions() {
    const newRecognition: DietitianRecognitions = {
      awardsOrRecognitions: '',
      yearOfRecognition: ''
    }
    if (this.recognitions && this.recognitions != null && this.recognitions.length > 0)
      this.recognitions.push(newRecognition);
    else
      this.recognitions = [newRecognition];
  }

  addExperiences() {
    const newExperienceDetail: DietitianExperienceDetails = {
      organization: '',
      fromYear: '',
      toYear: ''
    }
    if (this.experienceDetails && this.experienceDetails != null && this.experienceDetails.length > 0)
      this.experienceDetails.push(newExperienceDetail);
    else
      this.experienceDetails = [newExperienceDetail];
  }

  onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {

        this.imageSrc = reader.result as string;
        console.log("Image -> " + this.imageSrc);

        /*this.myForm.patchValue({
          itemImage: reader.result as string
        });*/

      };

    }
  }
}
