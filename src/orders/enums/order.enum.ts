export enum OrderStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  PickedUp = 'picked_up',
  InTransit = 'in_transit',
  Delivered = 'delivered',
  Cancelled = 'cancelled',

  // Uppercase aliases
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum DeliveryType {
  Regular = 'regular',
  Express = 'express',

  // Uppercase aliases
  REGULAR = 'regular',
  EXPRESS = 'express',
}

export enum ParcelType {
  Document = 'document',
  Parcel = 'parcel',
  Fragile = 'fragile',

  // Uppercase aliases
  DOCUMENT = 'document',
  PARCEL = 'parcel',
  FRAGILE = 'fragile',
}
