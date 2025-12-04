import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ItestimonailRes, Itestimonails, ItestimonailsRes } from '../models/testimonial.model';

@Injectable({
  providedIn: 'root',
})
export class TestmonService {
   constructor(private _http:HttpClient){}
  apiURL=environment.apiURL+"/testmon";
  getNewTestimonials():Observable<ItestimonailsRes>{
    return this._http.get<ItestimonailsRes>(this.apiURL+"/new")
  }
  getOldTestimonials():Observable<ItestimonailsRes>{
    return this._http.get<ItestimonailsRes>(this.apiURL+"/old")
  }
  approveTestmonials(id:string):Observable<ItestimonailRes>{
    return this._http.put<ItestimonailRes>(`${this.apiURL}/approve/${id}`,{} )
  }
   hideTestmonials(id:string):Observable<ItestimonailRes>{
    return this._http.put<ItestimonailRes>(`${this.apiURL}/hide/${id}`,{} )
  }
  getATestmonials():Observable<ItestimonailsRes>{
    return this._http.get<ItestimonailsRes>(this.apiURL+"/public")
  }
  addTestimonials(testMon:Itestimonails):Observable<ItestimonailRes>{
    return this._http.post<ItestimonailRes>(this.apiURL,testMon);
  }
}
