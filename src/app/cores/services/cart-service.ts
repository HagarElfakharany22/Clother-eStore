import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, forkJoin, Observable, of, tap } from 'rxjs';
import { ICartItem, ICartRes, Iitem } from '../models/cart.model';
import { AuthService } from './auth-service';
import { IProduct } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private _http:HttpClient,private _auth:AuthService){}
  apiURL=environment.apiURL+"/cart";
  private localStorageKey = 'guestCart';
  cartItemsCount = new BehaviorSubject<number>(0);
  // cartItemsCount$ = this.cartItemsCount.asObservable();
  private isLoggedIn(): boolean {
   return this._auth.isLoggedIn();
  }
   getCart(): Observable<ICartRes> {
    if (this.isLoggedIn()) {
      return this._http.get<ICartRes>(this.apiURL);
    } else {
      return of(this.getLocalCart());
    }
  }
 addToCart(item: Iitem): Observable<ICartRes> {
  if (this.isLoggedIn()) {
    return this._http.post<ICartRes>(this.apiURL, item).pipe(
      tap(() => this.updateCartCount())
    );
  } else {
    return of(this.addToLocalCart(item));
  }
}
  deleteItem(id:string){
    if (this.isLoggedIn()) {
    return this._http.delete(`${this.apiURL}/${id}`).pipe(
      tap(() => this.updateCartCount())
    );
    }
    else{
      return of(this.deleteFromLocalCart(id));
    }
  }
  clearCart(){
    if (this.isLoggedIn()) {
    return this._http.delete(this.apiURL).pipe(
      tap(() => this.updateCartCount())
    );
    }
    else{
       localStorage.removeItem(this.localStorageKey);
      this.updateCartCount();
      return of({ message: 'Cart cleared' });
    }
  }
  updateCart(id:string,quantity:number):Observable<ICartRes>{
    if(this.isLoggedIn()){
    return this._http.put<ICartRes>(`${this.apiURL}/${id}`,{quantity}).pipe(
      tap(() => this.updateCartCount())
    );
    }
    else{
      return of(this.updateLocalCart(id, quantity));
    }
  }
  syncCartAfterLogin(): Observable<any> {
  const localCart = this.getLocalCart();

  if (!localCart.data.items || localCart.data.items.length === 0) {
    return of(null);  
  }

  const requests = localCart.data.items.map(item =>
    this._http.post<ICartRes>(this.apiURL, {
      productId: item.productId._id,
      quantity: item.quantity
    })
  );

  return forkJoin(requests).pipe(
    tap(() => {
      localStorage.removeItem(this.localStorageKey); 
      this.updateCartCount(); 
    })
  );
}
  /////////// local storage handle///
   private getLocalCart(): ICartRes {
    const cartData = localStorage.getItem(this.localStorageKey);
    if (cartData) {
      return JSON.parse(cartData);
    }
    return {
      message: 'Guest cart',
      data: {
        _id: 'local-cart',
        userId: 'guest',
        items: [],
        totalPrice: 0,
      },
    };
  }
  private addToLocalCart(item:Iitem): ICartRes {
    const cart = this.getLocalCart();
    
    const existingItem = cart.data.items.find(
      i => i.productId._id === item.productId
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.data.items.push({
        _id: `local-${Date.now()}`,
        productId: {
          _id: item.productId,
          name: item.name,
          imgURL:item.imgURL,
          price: item.price,
        },
        price:item.price,
        quantity: item.quantity,
      });
    }
   
    cart.data.totalPrice = cart.data.items.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );

    localStorage.setItem(this.localStorageKey, JSON.stringify(cart));
    this.updateCartCount();
    return cart;
  }

  private updateLocalCart(id: string, quantity: number): ICartRes {
    const cart = this.getLocalCart();
    const item = cart.data.items.find(i => i._id === id);

    if (item) {
      item.quantity = quantity;
      
      cart.data.totalPrice = cart.data.items.reduce(
        (total, item) => total + item.productId.price * item.quantity,
        0
      );

      localStorage.setItem(this.localStorageKey, JSON.stringify(cart));
      this.updateCartCount();
    }

    return cart;
  }
    private deleteFromLocalCart(id: string): any {
    const cart = this.getLocalCart();
    cart.data.items = cart.data.items.filter(i => i._id !== id);
    
    cart.data.totalPrice = cart.data.items.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );

    localStorage.setItem(this.localStorageKey, JSON.stringify(cart));
    this.updateCartCount();
    return { message: 'Item deleted' };
  }
 updateCartCount(): void {
    if (this.isLoggedIn()) {
      this._http.get<ICartRes>(this.apiURL).subscribe({
        next: res => {
          const count = res.data.items.reduce((sum, item) => sum + item.quantity, 0);
          this.cartItemsCount.next(count);
        },
        error: () => this.cartItemsCount.next(0)
      });
    } else {
      const cart = this.getLocalCart();
      const count = cart.data.items.reduce((sum, item) => sum + item.quantity, 0);
      this.cartItemsCount.next(count);
    }
  }
   getCartCount(): number {
    return this.cartItemsCount.value;
  }
}
