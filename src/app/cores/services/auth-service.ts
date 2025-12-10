import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { ILoginData, ILoginRes, ITokenDecode } from '../models/auth.model';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userData = new BehaviorSubject<ITokenDecode | null>(null)


  apiURL = environment.apiURL + '/auth/login';
  constructor(private _http: HttpClient, private _router: Router) { }
  private TOKEN_KEY: string = 'token';
  private setToken(token: string) {

    localStorage.setItem(this.TOKEN_KEY, token)
  }
  login(data: ILoginData) {
    return this._http.post<ILoginRes>(this.apiURL, data).pipe(
      tap((res) => {
        console.log('res', res);
        const token = res.data;

        this.setToken(token);
        const decode = this.tokenDecode(token);
        console.log(decode);
        if (decode) {
          if (decode.role === 'admin') {

            this._router.navigate(['/dashboard']);
          }
          else {
            this._router.navigate(['/home']);
          }

          this.userData.next(decode);

        }

      })
    );
  }
  private tokenDecode(token: string): ITokenDecode | null {
    try {
      const decode = jwtDecode<ITokenDecode>(token);
      return decode;
    }
    catch (err) {
      return null;
    }
  }
  checkToken() {
    const token = this.getToken();
    if (token) {
      if (this.isValidToken(token)) {
        const decode = this.tokenDecode(token);
        this.userData.next(decode);
      }
      else {
        this.logOut();
      }

    }

  }

  isValidToken(token: string) {

    if (token) {
      const decode = this.tokenDecode(token);
      if (decode) {
        const exp = decode.exp * 1000;
        if (Date.now() < exp) {
          return true
        }
      }
    }
    return false
  }

  isAuthanticateUser() {
    const token = this.getToken();
    if (token) {
      if (this.isValidToken(token)) {
        const decode = this.tokenDecode(token);
        if (decode?.role === 'user') {
          return true
        }

      }
    }
    return false;
  }

  isAuthanticateAdmin() {
    const token = this.getToken();
    if (token) {
      if (this.isValidToken(token)) {
        const decode = this.tokenDecode(token);
        if (decode?.role === 'admin') {
          return true
        }

      }
    }
    return false;
  }

  logOut() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.userData.next(null);
  }

  getUserData() {
    return this.userData.asObservable();
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
   public isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
