export interface IAddress {
  governate: string;
  city: string;
  addressDetails: string;
}

export interface IOrderItem {
  productId: {
    _id?: string;
    name?: string;
    price?: number;
    imgURL:string
  };
  quantity: number;
  priceAtOrder: number;
}
export interface IOrderCreate {
  address: IAddress;
  phone: string;
}
export interface IOrder {
  _id: string;
  user: {
    _id?: string;
    name?: string;
  };
  address: IAddress;
  phone: string;
  items: IOrderItem[];
  totalPrice: number;
  orderStatus: 'pending' | 'prepared' | 'shipped' | 'recieved' | 'returned' | 'request refund'|'refund' | 'refused' | 'canceled';
  orderAt: Date;
}

export interface IOrderResponse {
  message: string;
  data: IOrder;
}

export interface IOrdersResponse {
  message: string;
  data: IOrder[];
}