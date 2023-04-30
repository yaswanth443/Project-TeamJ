import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { AppConstants } from '../../model/app-constants';
import { LookupUnits, SubscriptionResponse } from '../../model/user-detail';
import { SharedService } from '../../service/shared.service';
import { DietitianDetialDialogComponent } from '../dietitian-detial-dialog/dietitian-detial-dialog.component';

@Component({
  selector: 'app-list-dieticians',
  templateUrl: './list-dieticians.component.html',
  styleUrls: ['./list-dieticians.component.scss']
})
export class ListDieticiansComponent implements OnInit {

  constructor(private sharedService: SharedService,
    private _router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog) { }

  @ViewChild('paginator') paginator!: MatPaginator;
  dataSource!: MatTableDataSource<SubscriptionResponse>;
  dietitiansData!: SubscriptionResponse[];
  displayedColumns: string[] = ['firstName', 'userName', 'phoneNumber', 'price', 'rating', 'hired', 'actions'];
  private rating: number = 0;
  private starCount: number = 5;
  ratingArr: Array<number> = [];
  selectedFilter!: LookupUnits;

  max = 5;
  rate = 2;
  isReadonly = false;
  step=0;
  sex="";
  sleep="";
  quesres="";
  nutrition="";
  phyActivity = "";
  hydration = '';
  selectedRecord!: SubscriptionResponse;
  addOnBlur = true;
  frequency!: string;
  mealPreference!: string;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  preferredOptions!: LookupUnits[];
  allServiceCategories!: LookupUnits[];
  diabeticDietLookup!: LookupUnits;
  kidsDietLookup!: LookupUnits;
  healthyDietLookup!: LookupUnits;
  weightGainDietLookup!: LookupUnits;
  reduceCholesterolDietLookup!: LookupUnits;

  ngOnInit(): void {
    let filter = this.route.snapshot.paramMap.get("filter");
    if (filter && filter != null) {
      let filterJSON = JSON.parse(filter);
      this.optionSelected(filterJSON);
    }
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
    this.sharedService.get(AppConstants.GET_PREFERRED_OPTION_LOOKUPS.replace("{lookupTypeId}", "4")).subscribe(
      (res: any) => {
        this.preferredOptions = res;
      },
      (err: any) => {
        this.sharedService.displayMessage("Error Occurred while fetching preferred options: " + JSON.stringify(err), 'blue-snackbar');
      });
    this.sharedService.get(AppConstants.GET_PREFERRED_OPTION_LOOKUPS.replace("{lookupTypeId}", "5")).subscribe(
      (res: any) => {
        this.allServiceCategories = res;
        this.allServiceCategories.filter(diet => {
          if (diet.unitLookupCode == 'DIET_CATEGORY_1') {
            this.kidsDietLookup = diet;
            return false;
          }
          else if (diet.unitLookupCode == 'DIET_CATEGORY_10') {
            this.reduceCholesterolDietLookup = diet;
            return false;
          }
          else if (diet.unitLookupCode == 'DIET_CATEGORY_15') {
            this.diabeticDietLookup = diet;
            return false;
          }
          else if (diet.unitLookupCode == 'DIET_CATEGORY_16') {
            this.healthyDietLookup = diet;
            return false;
          }
          else if (diet.unitLookupCode == 'DIET_CATEGORY_17') {
            this.weightGainDietLookup = diet;
            return false;
          }
          return true;
        })
      },
      (err: any) => {
        this.sharedService.displayMessage("Error Occurred while fetching preferred options: " + JSON.stringify(err), 'blue-snackbar');
      });
  }

  optionSelected(option: LookupUnits) {
    this.step = 2;
    this.selectedFilter = option;
    this.loadDietitians();
  }

  loadDietitians() {
    this.sharedService.get(AppConstants.GET_DIETITIANS + "/" + this.selectedFilter.unitLookupCode).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        /*this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.paginator = this.paginator;*/
        this.dietitiansData = res.content;
      },
      error: (err) => console.log("Error loading data: " + err)
    });
  }

  hire(element: SubscriptionResponse) {
    const dialogConfig = new MatDialogConfig();
    if (!element.allergens)
      element.allergens = [];
    dialogConfig.data = {
      dietitian: element
    };
    dialogConfig.width = "60%";
    const dialogRef = this.dialog.open(DietitianDetialDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.step = 2;
      this.loadDietitians();
    });
  }

  recieveInputs(dietitanDetails: SubscriptionResponse) {
    if (dietitanDetails.status.unitLookupCode == '') {
      this.selectedRecord = dietitanDetails;
      this.step = 3;
      this.selectedRecord.allergens = [];
    } else {
      this.hire(dietitanDetails);
    }
  }

  showIcon(index: number, userName: string) {
    let dataObject = this.dataSource.data.find(data => data.userName === userName);

    if (dataObject && dataObject.rating!=null && dataObject.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  getRatingMessage(userName: string) {
    let dataObject = this.dataSource.data.find(data => data.userName === userName);
    if (dataObject && dataObject.rating != null) {
      return "Rating: " + dataObject.rating +" / 5";
    }
    return "Rating: 0 / 5";
  }

  viewProfile(userName: string) {
    this._router.navigate(['/dieticians/profile', { userName: userName }]);
  }

  mySurvey(result: any, key: string) {
    if (key == "quesres") {
      this.selectedRecord.quesres = result;
      this.step = 4;
    }
    else if (key == "sex") {
      this.selectedRecord.sex = result;
      this.step = 5;
    }
    else if (key == "sleep") {
      this.selectedRecord.sleep = result;
      this.step = 6;
    }
    else if (key == "nutrition") {
      this.selectedRecord.nutrition = result;
      this.step = 7;
    }
    else if (key == "hydration") {
      this.selectedRecord.hydration = result;
      this.step = 8;
    }
    else if (key == "phyActivity") {
      this.selectedRecord.phyActivity = result;
      this.step = 9;
    }
    else if (key == "mealFrequency") {
      this.frequency = result;
      this.step = 10;
    }
    else if (key == "mealPreference") {
      this.selectedRecord.preferredMealOption = result;
      this.step = 11;
    }
    else if (key == "allergens") {
      this.step = 12;
      this.hire(this.selectedRecord);
    }
  }

  submitSurvey() {
    console.log("next");
  }

  //functions related to mat chip

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.selectedRecord.allergens.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(allergy: string): void {
    const index = this.selectedRecord.allergens.indexOf(allergy);

    if (index >= 0) {
      this.selectedRecord.allergens.splice(index, 1);
    }
  }
}
