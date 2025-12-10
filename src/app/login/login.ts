import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../cores/services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../cores/services/cart-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
loginForm: FormGroup = new FormGroup({
  email: new FormControl(''),
  password:new FormControl('')
});
constructor(private _authService:AuthService,private router:Router,private _cartService:CartService){}
login(){
  this._authService.login(this.loginForm.value).subscribe(
  {
    next: (data)=>{
       console.log(data)
      this._cartService.syncCartAfterLogin().subscribe({
          next: () => {
            console.log('Cart synced successfully');
            this.router.navigate(['/home']);
          },
          error: (err) => {
            console.error('Error syncing cart:', err);
            this.router.navigate(['/home']);
          }
        });
      }
    ,
    error: (err)=> {
      console.log(err);
    },
  }
);
  
}
}
