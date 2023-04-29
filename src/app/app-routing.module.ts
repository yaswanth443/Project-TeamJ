import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { DefaultPageComponent } from './component/default-page/default-page.component';
import { ListAllItemsComponent } from './component/item/list-all-items/list-all-items.component';
import { ListAllDieticianCustomersComponent } from './component/list-all-dietician-customers/list-all-dietician-customers.component';
import { ListDieticiansComponent } from './component/list-dieticians/list-dieticians.component';
import { LoginComponent } from './component/login/login.component';
import { ProfileComponent } from './component/profile/profile.component';
import { SignupComponent } from './component/signup/signup.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { OrderFoodComponent } from './component/order-from-restaurant/order-from-restaurant.component';
import { ConfigureRestaurantMenuComponent } from './component/item/display-or-create-restaurant-items/configure-restaurant-items.component';
import { RestaurantViewItemComponent } from './component/item/restaurant-view-item/restaurant-view-item.component';
import { CustomerRestaurantOrdersComponent } from './component/customer-restaurant-orders/customer-restaurant-orders.component';
import { HistoricalRestaurantOrdersComponent } from './component/historical-restaurant-orders/historical-restaurant-orders.component';
import { CreateStaticMenuComponent } from './component/item/create-static-menu/create-static-menu.component';
import { ViewStaticItemsComponent } from './component/item/view-static-menu/view-static-menu.component';
import { ListDieticianSaveMenusComponent } from './component/list-dietician-saved-menus/list-dietician-saved-menus.component';
import { DetailUserProfileComponent } from './component/user-profile/detail-user-profile/detail-user-profile.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { RestaurantDashboardRecurringComponent } from './component/restaurant-dashboard-recurring/restaurant-dashboard-recurring.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'dieticians',
    component: ListDieticiansComponent,
  },
  {
    path: 'items-view',
    component: RestaurantViewItemComponent,
  },
  {
    path: 'customers',
    component: ListAllDieticianCustomersComponent,
  },
  {
    path: 'configure-menu',
    component: RestaurantViewItemComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'dieticians/profile',
    component: DetailUserProfileComponent,
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'order-food',
    component: OrderFoodComponent
  },
  {
    path: 'all-orders',
    component: CustomerRestaurantOrdersComponent
  },
  {
    path: 'past-orders',
    component: HistoricalRestaurantOrdersComponent
  },
  {
    path: 'daily-orders',
    component: RestaurantDashboardRecurringComponent
  },
  {
    path: 'create-menu',
    component: CreateStaticMenuComponent
  },
  {
    path: 'view-menu',
    component: ListDieticianSaveMenusComponent
  },
  {
    path: '',
    component: DefaultPageComponent
  },
  {
    path: 'resetPassword',
    component: ResetPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
