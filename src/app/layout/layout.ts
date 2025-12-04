import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CartService } from '../cores/services/cart-service';
import { AuthService } from '../cores/services/auth-service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,RouterLink,CommonModule,FormsModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {
searchQuery = '';
cartCount = 0;
constructor(private cartService:CartService,private _authService:AuthService ,private _router:Router){}
ngOnInit(): void {
  this.cartService.getCart().subscribe({
    next:(res)=>{
     this.cartCount= res.data.items.length;
     this.loadCart();
    }
  })
 
}
islogged = false;

loadUser(): void {
  this._authService.getUserData().subscribe({
    next: (res) => {
      if (res?.name) {
        this.islogged = true;
        console.log(this.islogged);
        
      } else {
        this.islogged = false;
        console.log(this.islogged);
        
      }
    },
    error: () => {
      this.islogged = false; 
      console.log(this.islogged);
      
    }
  });
}


  loadCart(): void {
   
    this.cartService.getCart().subscribe({
      next: (res) => {
      
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        
      }
    });
  }
onSearch(){ }; 
logout(){ this._authService.logOut() ;
  this._router.navigate(['/home']);
}
}
