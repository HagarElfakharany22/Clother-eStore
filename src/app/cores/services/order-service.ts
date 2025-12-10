import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrder, IOrderCreate, IOrderResponse, IOrdersResponse } from '../models/orders.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private _http: HttpClient) {}
  apiURL = environment.apiURL + '/order';

  getAllOrders(): Observable<IOrdersResponse> {
    return this._http.get<IOrdersResponse>(this.apiURL);
  }
 getMyOrders(): Observable<IOrdersResponse> {
    return this._http.get<IOrdersResponse>(`${this.apiURL}/userOrder`);
  }
  changeOrderStatus(id: string, orderStatus: string): Observable<IOrderResponse> {
    return this._http.put<IOrderResponse>(`${this.apiURL}/changeStatus/${id}`, {
      orderStatus,
    });
  }
 createOrder(orderData: IOrderCreate): Observable<IOrderResponse> {
    return this._http.post<IOrderResponse>(this.apiURL, orderData);
  }
  updateOrder(id: string, updates: Partial<IOrder>): Observable<IOrderResponse> {
    return this._http.put<IOrderResponse>(`${this.apiURL}/${id}`, updates);
  }
   cancelOrder(id: string): Observable<IOrderResponse> {
    return this._http.put<IOrderResponse>(`${this.apiURL}/${id}`, {
      orderStatus: 'canceled',
    });
  }
  approveRefund(orderId: string, updates: Partial<IOrder>): Observable<IOrderResponse>{
    return this._http.put<IOrderResponse>(`${this.apiURL}/approverefund/${orderId}`,{orderStatus: 'refund'})
  }
}
