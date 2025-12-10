import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IPaginatedProductsResponse, IProductResponse, IProductsResponse } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private _http:HttpClient){}
  apiURL=environment.apiURL+"/products";
   // Get paginated products with filters


  getAllProducts(): Observable<IProductsResponse> {
    return this._http.get<IProductsResponse>(this.apiURL);
  }

  
  getProductBySlug(slug: string): Observable<IProductResponse> {
    return this._http.get<IProductResponse>(`${this.apiURL}/${slug}`);
  }

  
  addProduct(formData: FormData): Observable<IProductResponse> {
    return this._http.post<IProductResponse>(this.apiURL, formData);
  }

 
  updateProduct(id: string, formData: FormData): Observable<IProductResponse> {
    return this._http.put<IProductResponse>(`${this.apiURL}/${id}`, formData);
  }

  
  deleteProduct(id: string): Observable<{ message: string }> {
    return this._http.delete<{ message: string }>(`${this.apiURL}/${id}`);
  }

  
  getProducts(page: number, limit: number): Observable<IPaginatedProductsResponse> {
  return this._http.get<IPaginatedProductsResponse>(`${this.apiURL}/pangatedproducts?page=${page}&limit=${limit}`);
}
}
