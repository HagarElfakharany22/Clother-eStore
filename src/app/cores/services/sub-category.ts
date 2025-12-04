import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ISubcategoriesResponse, ISubCategoryCreate, ISubCategoryResponse } from '../models/subCat.model';

@Injectable({
  providedIn: 'root',
})
export class SubCategory {
  constructor(private _http:HttpClient){}
  apiURL=environment.apiURL+"/subcategory";
    getAllSubCategories(): Observable<ISubcategoriesResponse> {
    return this._http.get<ISubcategoriesResponse>(this.apiURL)
  }
   getSubCategoryBySlug(slug: string): Observable<ISubCategoryResponse> {
    return this._http.get<ISubCategoryResponse>(`${this.apiURL}/${slug}`)
  }
 addSubCategory(category: ISubCategoryCreate): Observable<ISubCategoryResponse> {
    return this._http.post<ISubCategoryResponse>(this.apiURL, category)
    
  }

  updateSubCategory(id: string,category:ISubCategoryCreate): Observable<ISubCategoryResponse> {
    return this._http.put<ISubCategoryResponse>(`${this.apiURL}/${id}`, category)
  }

  deleteSubCategory(id: string): Observable<void> {
    return this._http.delete<void>(`${this.apiURL}/${id}`);
  }
}
