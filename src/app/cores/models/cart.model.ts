// cart.model.ts
export interface Iitem {
  productId: string;
  quantity: number;
  imgURL:string;
  price:number;
  name:string
}

export interface ICartItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    imgURL?: string;
  };
  price:number;
  quantity: number;
}

export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
  totalPrice: number;
}

export interface ICartRes {
  message: string;
  data: ICart;
}