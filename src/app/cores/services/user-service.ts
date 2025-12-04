import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Iuser, IUserResponse, IUsersResponse } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _http:HttpClient){}
  apiURL=environment.apiURL+'/user';
  Register(userData:Iuser){
   return this._http.post(this.apiURL,userData);
  }

  getAllUsers(): Observable<IUsersResponse> {
    return this._http.get<IUsersResponse>(this.apiURL);
  }
  getUser(id:string):Observable<IUserResponse>{
    return this._http.get<IUserResponse>(`${this.apiURL}/${id}`);
  }

  updateUserInfo(userId: string, data: Partial<Iuser>): Observable<IUserResponse> {
    return this._http.put<IUserResponse>(`${this.apiURL}/${userId}`, data);
  }

 
  toggleBlockUser(id: string, isBlocked: boolean): Observable<IUserResponse> {
    return this.updateUserInfo(id, { isBlocked });
  }
   deleteUser(id: string): Observable<IUserResponse> {
    return this._http.delete<any>(`${this.apiURL}/${id}`);
  }
}
