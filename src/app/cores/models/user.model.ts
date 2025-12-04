interface IAddress {
  governate: string;
  city: string;
  addressDetails: string;
  isDefault: boolean;
}
export interface Iuser{
    _id:string,
    name:string,
    email:string,
    password:string,
    phone:string,
    isBlocked: boolean;
    address:[{governate:string,city:string,addressDetails:string}];
    // address:IAddress[]
}
export interface IUserResponse {
  message: string;
  data: Iuser;
}

export interface IUsersResponse {
  message: string;
  data: Iuser[];
}