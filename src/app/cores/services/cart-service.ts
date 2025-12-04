import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ICartItem, ICartRes, Iitem } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private _http:HttpClient){}
  apiURL=environment.apiURL+"/cart";
  getCart():Observable<ICartRes>{
    return this._http.get<ICartRes>(this.apiURL);
  }
  addToCart(item:Iitem):Observable<ICartRes>{
    return this._http.post<ICartRes>(this.apiURL,item);
  }
  deleteItem(id:string){
    return this._http.delete(`${this.apiURL}/${id}`)
  }
  clearCart(){
    return this._http.delete(this.apiURL)
  }
  updateCart(id:string,quantity:number):Observable<ICartRes>{
    return this._http.put<ICartRes>(`${this.apiURL}/${id}`,{quantity})
  }
}
