export class UserDetail {
  firstName!: string;
  lastName!: string;
  userName!: string;
  phoneNumber!: string;
  password!: string;
  userType!: string;
  price!: string;
  restaurantName!: string;
}
export class UserUpdateDetail {
  firstName!: string;
  lastName!: string;
  userName!: string;
  phoneNumber!: string;
  password!: string;
  userType!: string;
  price!: string;
  title!: string;
  overallExperience!: string;
  specialistExperience!: string;
  qualifiedDegree!: LookupUnits;
  degreeUniversity!: string;
  degreeYear!: string;
  extraEducationDetails!: EducationDetails[];
  recognitions!: DietitianRecognitions[];
  experienceDetails!: DietitianExperienceDetails[];
  bio!: string;
  address!: string;
  services!: LookupUnits[];
  /*recognitions!: Recognitions[];
  experienceDetails!: ExperienceDetails[];*/
  cuisines!:LookupUnits[];
  avgCost!: string;
  restaurantName!: string;
  restaurantImage!: string;
  userProfileImage!: string;
  certified!: string;
  userProfileActivated!: string;
}
export class UserLoginDetail {
  userName!: string;
  password!: string;
  userType!: string;
}
export class SubscriptionResponse {
  firstName!: string;
  lastName!: string;
  userName!: string;
  phoneNumber!: string;
  price!: number;
  subscriptionAmount!: number;
  status!: LookupUnits;
  customerInput!: string;
  dietitianInput!: string;
  preferredMealOption!: LookupUnits;
  rating!: number;
  allergens!: string[];
  sex!: string;
  sleep!: string;
  quesres!: string;
  nutrition!: string;
  phyActivity!: string;
  hydration!: string;
  userProfileImage!: string;
}
export class LookupUnits {
  unitLookupCode!: string;
  unitLookupValue!: string;
}
export class Rating {
  username!: string;
  fullName!: string;
  rating!: number;
  commentCategory!: LookupUnits;
  commentOptions!: LookupUnits[];
  comments!: string;
  recommended!: boolean;
}
export class Recognitions {
  awardsOrRecognitions!: string;
  yearOfRecognition!: number;
}
export class ExperienceDetails {
  fromYear!: string;
  toYear!: string;
  organization!: string;
}
export class RestaurantDetails {
  firstName!: string;
  userName!: string;
  phoneNumber!: string;
  avgCost!: number;
  cuisines!: LookupUnits[];
  rating!: number;
  restaurantName!: string;
  restaurantImage!: string;
}
export class RestaurantItems {
  restaurantUserName!: string;
  parentItemName!: string;
  childItems!: RestaurantChildItem[];
  panelOpenState: boolean = false; //used to show/hide panel
}
export class RestaurantChildItem {
  itemName!: string;
  availableFromTime!: string;
  availableToTime!: string;
  itemDescription!: string;
  isActive!: string;
  itemImage!: string;
  itemCategory!: string;
  itemWeightsAndPrices!: ItemWeightsAndPrices[];
  count: number = 0; //used to show count
}
export class ItemWeightsAndPrices {
  itemPrice!: number;
  quantity!: string;
  quantityUnit!: LookupUnits;
}

export class ParentAndChildItems {
  itemName!: string;
  itemDescription!: string;
  itemImage!: string;
  panelOpenState: boolean = false; //used to show/hide panel
  childItems!: ParentAndChildItems[];
  count: number = 0; //used to show count
  itemUnitsAndCodes!: LookupUnits[];
}
export class Menu {
  menuName!: string;
  createdOrModifiedDate!: Date;
}
export class MenuItems {
  parentItemName!: string;
  childItemName!: string;
  quantity!: number;
  quantityUnit!: LookupUnits;
  instructions!: string;
  isEdit: boolean = false;
  isSelected: boolean = false;
  isAdd: boolean = false;
}
export interface EducationDetails {
  qualifiedDegree: LookupUnits;
  degreeUniversity: string;
  degreeYear: string;
};
export interface DietitianRecognitions {
  awardsOrRecognitions: string;
  yearOfRecognition: string;
};
export interface DietitianExperienceDetails {
  organization: string;
  fromYear: string;
  toYear: string;
};
