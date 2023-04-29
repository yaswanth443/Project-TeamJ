import { ItemWeightsAndPrices } from "./user-detail";

export class RecurringOrderDetails {
  itemName!: string;
  childItems!: string;
  quantityAndUnit!: string;
  instructions!: string;
  fromDate!: Date;
  toDate!: Date;
  deliveryTime!: string;
  orderId!: string;
  price!: number;
  restaurantName!: string;

  selectedChildItem!: string;
}
export class DietitianRecurringOrderDetails {
  orderId!: string;
  customerName!: string;
  customerAddress!: string;
  customerUsername!: string;
  dietitianName!: string;
  orderStatus!: string;
  orderStatusCode!: string;
}
export class Orders {
  orderId!: string;
  customerName!: string;
  deliveryAddress!: string;
  customerUsername!: string;
  restaurantName!: string;
  dietitianName!: string;
  orderStatus!: string;
  orderStatusCode!: string;
  orderTotalPrice!: number;
  orderItems!: OrderItems[];
}
export class OrderItems {
  quantity!: number;
  childItemName!: string;
  parentItemName!: string;
  itemWeightsAndPrices!: ItemWeightsAndPrices;
  recurringOrderId!: number;
}
