export interface Category {
  _id: string;
  name: string;
  slug: string;
}
export interface ISubCategory {
  _id: string;
  name: string;
  slug: string;
 category:{_id :string};
  createdAt?: Date;
  isActive:boolean
}
  export interface ISubCategoryCreate {
  name: string;
  slug: string;
  categoryId:string,
  isActive: boolean;
}

export interface ISubCategoryResponse{
  message: string;
  data:ISubCategory;
}
export interface ISubcategoriesResponse{
  message: string;
  data: ISubCategory[];
}