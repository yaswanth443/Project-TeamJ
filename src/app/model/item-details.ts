export interface Item {
  isSelected: boolean;
  itemName: string;
  quantity: number;
  quantityUnit: string;
  childItems: string;
  isEdit: boolean;
  isAdd: boolean;
}

export interface ItemForOrderMeal {
  isSelected: boolean;
  itemName: string;
  quantity: number;
  quantityUnit: string;
  childItems: string;
  restaurant: string;
  fromDate: Date;
  toDate: Date;
  deliveryTime: string;
  isEdit: boolean;
  isAdd: boolean;
}

export interface ItemDetail {
  itemName: string;
  itemUnitsAndCodes: Array<ItemUnitLookup>;
}

export interface ItemUnitLookup {
  unitLookupCode: string;
  unitLookupValue: string;
}

export interface RestaurantSearchDetails {
  restaurantName: string;
  userName: string;
}

export interface RestaurantSearchDetailsArray {
  restaurantDetails: RestaurantSearchDetails[];
}

export const ItemColumns = [
  {
    key: 'isSelected',
    type: 'isSelected',
    label: '',
  },
  {
    key: 'itemName',
    type: 'item',
    label: 'Item Category',
    required: true,
  },
  {
    key: 'childItems',
    type: 'childItem',
    label: 'Items',
    required: true,
  },
  {
    key: 'quantity',
    type: 'text',
    label: 'Item Quantity',
    required: true,
  },
  {
    key: 'quantityUnit',
    type: 'itemUnit',
    label: 'Quantity Unit',
    required: true,
  },
  {
    key: 'instructions',
    type: 'text',
    label: 'Any Instructions',
    required: true,
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];

export const ItemColumnsForOrderMeal = [
  {
    key: 'itemName',
    type: 'item',
    label: 'Item Category',
    required: true,
  },
  {
    key: 'childItems',
    type: 'childItem',
    label: 'Items',
    required: true,
  },
  {
    key: 'quantity',
    type: 'text',
    label: 'Quantity',
    required: true,
  },
  {
    key: 'quantityUnit',
    type: 'itemUnit',
    label: 'Quantity Unit',
    required: true,
  },
  {
    key: 'instructions',
    type: 'text',
    label: 'Instructions',
    required: true,
  },
  {
    key: 'restaurant',
    type: 'restaurant',
    label: 'Restaurant',
    required: true,
  },
  {
    key: 'fromDate',
    type: 'date',
    label: 'Required From',
    required: true,
  },
  /*{
    key: 'toDate',
    type: 'date',
    label: 'Required Till',
    required: true,
    isEdit: true
  },*/
  {
    key: 'deliveryTime',
    type: 'time',
    label: 'Delivery Time',
    required: true,
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];

export const MenuItemColumns = [
  {
    key: 'isSelected',
    type: 'isSelected',
    label: '',
  },
  {
    key: 'parentItemName',
    type: 'item',
    label: 'Category',
    required: true,
  },
  {
    key: 'childItemName',
    type: 'childItem',
    label: 'Item',
    required: true,
  },
  {
    key: 'quantity',
    type: 'text',
    label: 'Quantity',
    required: true,
  },
  {
    key: 'quantityUnit',
    type: 'qty',
    label: 'Quantity unit',
    required: true,
  },
  {
    key: 'instructions',
    type: 'text',
    label: 'Any Instructions',
    required: true,
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];
