export interface Itestimonails{
    _id:string,
   user:{_id:string,name:string,email:string};
   message:string;
   isVisible:boolean;
   status:string;
   createdAt:Date;
   rating:number
}
export interface ItestimonailsRes{
    message:string;
    data:Itestimonails[]
}
export interface ItestimonailRes{
    message:string;
    data:Itestimonails
}