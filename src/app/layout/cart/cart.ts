import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICart, ICartItem, Iitem } from '../../cores/models/cart.model';
import { CartService } from '../../cores/services/cart-service';
import { environment } from '../../environments/environment';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
cart: ICart | null = null;
  isLoading = false;
 uploadUrl=environment.staticFilesURL;
  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    

    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cart = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.isLoading = false;
      }
    });
  }

  increaseQuantity(item: ICartItem): void {
    console.log(item.productId._id, item.quantity);
    this.cartService.updateCart(item.productId._id, item.quantity + 1).subscribe({
      next: (res) => {
        console.log(res.data)
        this.cart=res.data;
        this.loadCart();
      },
      error: (err) => {
        console.error('Error updating cart:', err);
        alert('Failed to update quantity');
      }
    });
  }

  decreaseQuantity(item: ICartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateCart(item.productId._id, item.quantity - 1).subscribe({
        next: () => {
          this.loadCart();
        },
        error: (err) => {
          console.error('Error updating cart:', err);
          alert('Failed to update quantity');
        }
      });
    } else {
      this.removeItem(item._id);
    }
  }

  removeItem(itemId: string): void {
    if (!confirm('Are you sure you want to remove this item?')) {
      return;
    }

    this.cartService.deleteItem(itemId).subscribe({
      next: () => {
        this.loadCart();
        alert('Item removed successfully!');
      },
      error: (err) => {
        console.error('Error removing item:', err);
        alert('Failed to remove item');
      }
    });
  }

  clearCart(): void {
    if (!confirm('Are you sure you want to clear your cart?')) {
      return;
    }

    this.cartService.clearCart().subscribe({
      next: () => {
        
        alert('Cart cleared successfully!');
      },
      error: (err) => {
        console.error('Error clearing cart:', err);
        alert('Failed to clear cart');
      }
    });
    this.loadCart();
  }

  getItemSubtotal(item: ICartItem): number {
    return item.productId.price * item.quantity;
  }

  proceedToCheckout(): void {
    if (!this.cart || this.cart.items.length === 0) {
      alert('Your cart is empty!');
      
      return;
    }
    // this.loadCart();
    this.router.navigate(['/checkout']);
  }
  // navigate(){
  //   console.log("clicked");
  //   this.router.navigateByUrl('/products');
  // }
}


