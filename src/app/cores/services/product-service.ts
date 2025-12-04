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
  getPaginatedProducts(
    page: number = 1,
    limit: number = 4,
    categorySlug?: string,
    subcategorySlug?: string,
    minPrice?: number,
    maxPrice?: number,
    sort: string = 'createdAt',
    order: string = 'asc'
  ): Observable<IPaginatedProductsResponse> {
    
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order);

    if (categorySlug) {
      params = params.set('category', categorySlug);
    }
    if (subcategorySlug) {
      params = params.set('subcategory', subcategorySlug);
    }
    if (minPrice !== undefined) {
      params = params.set('minPrice', minPrice.toString());
    }
    if (maxPrice !== undefined) {
      params = params.set('maxPrice', maxPrice.toString());
    }

    return this._http.get<IPaginatedProductsResponse>(
      this.apiURL+"/pangatedproducts",
      { params }
    );
  }

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

  
  // getPaginatedProducts(page: number = 1, limit: number = 10): Observable<any> {
  //   return this._http.get(`${this.apiURL}/paginated?page=${page}&limit=${limit}`);
  // }
}
