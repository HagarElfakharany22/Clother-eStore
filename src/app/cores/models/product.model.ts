export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  slug: string;
  imgURL: string;
  Category:{_id: string,name:string,slug:string};
  subCategory: {_id: string,name:string,slug:string};
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductResponse {
  message: string;
  data: IProduct;
}

export interface IProductsResponse {
  message: string;
  data: IProduct[];
}
export interface IPaginatedProductsResponse {
  page: number;
  limit: number;
  totalPages: number;
  totalResult: number;
  results: IProduct[];
}