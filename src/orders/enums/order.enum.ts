export enum OrderStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  PickedUp = 'picked_up',
  InTransit = 'in_transit',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export enum DeliveryType {
  Regular = 'regular',
  Express = 'express',
}

export enum ParcelType {
  Document = 'document',
  Parcel = 'parcel',
  Fragile = 'fragile',
}

