import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { categoriesResponse, categoryResponse, ICategoryCreate } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class Categoryservice {
  constructor(private _http:HttpClient){}
  apiURL=environment.apiURL+"/category";
    getAllCategories(): Observable<categoriesResponse> {
    return this._http.get<categoriesResponse>(this.apiURL)
  }
   getCategoryBySlug(slug: string): Observable<categoryResponse> {
    return this._http.get<categoryResponse>(`${this.apiURL}/${slug}`)
  }
 addCategory(category: ICategoryCreate): Observable<categoryResponse> {
    return this._http.post<categoryResponse>(this.apiURL, category)
    
  }

  updateCategory(id: string,category:ICategoryCreate): Observable<categoryResponse> {
    return this._http.put<categoryResponse>(`${this.apiURL}/${id}`, category)
  }

  deleteCategory(id: string): Observable<void> {
    return this._http.delete<void>(`${this.apiURL}/${id}`);
  }
}
