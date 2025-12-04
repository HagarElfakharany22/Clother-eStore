export interface IsubCategory {
  _id: string;
  name: string;
  slug: string;
}
export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  subCategories?: IsubCategory[];
  createdAt?: Date;
   isActive:boolean
}
export interface ICategoryCreate {
  name: string;
  slug: string;
   isActive:boolean
}

export interface categoryResponse{
  message: string;
  data: ICategory;
}
export interface categoriesResponse{
  message: string;
  data: ICategory[];
}