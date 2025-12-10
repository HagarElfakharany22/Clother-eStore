import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const checkoutGuard: CanActivateFn = (route, state) => {
   const _auth = inject(AuthService);
  const _router = inject(Router);
  if(_auth.isLoggedIn()){
    return true;
  }
  else{
    alert('Please login to proceed to checkout');
    _router.navigate(['/login']);
    return false;
  }
};
