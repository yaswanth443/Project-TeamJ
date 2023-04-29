import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from '../../model/app-constants';
import { RestaurantDetails } from '../../model/user-detail';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-order-from-restaurant',
  templateUrl: './order-from-restaurant.component.html',
  styleUrls: ['./order-from-restaurant.component.scss']
})
export class OrderFoodComponent implements OnInit {

  restaurants: Array<RestaurantDetails> = new Array<RestaurantDetails>();

  constructor(private _router: Router,
    public _sharedService: SharedService) { }

  ngOnInit(): void {
    this._sharedService.get(AppConstants.GET_ALL_RESTAURANTS)
      .subscribe(
        (res: any) => {
          this.restaurants = res.content;
        },
        (err: any) => {
          console.log("Error while loading get restaurants service: " + err);
          this._sharedService.displayMessage("Error loading data, Kindly contact administrator", "blue-snackbar");
        });
  }

  getCusines(restaurant: RestaurantDetails) {
    return restaurant.cuisines?.map(val => { return val.unitLookupValue; }).join(", ");
  }

  orderFood(restaurantUserName: string) {
    this._router.navigate(['/items-view', { restaurant: restaurantUserName }]);
  }

}
