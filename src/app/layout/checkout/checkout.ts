import { Component, OnInit } from '@angular/core';
import { ICart } from '../../cores/models/cart.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../cores/services/cart-service';
import { OrderService } from '../../cores/services/order-service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  cart: ICart | null = null;
  checkoutForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;
uploadUrl=environment.staticFilesURL;
  constructor(
   
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.checkoutForm = new FormGroup({
      governate:new FormControl ('', Validators.required),
      city: new FormControl ('', Validators.required),
      addressDetails:new FormControl ('', Validators.required),
      phone: new FormControl ('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cart = res.data;
        
        if (!this.cart || this.cart.items.length === 0) {
          alert('Your cart is empty!');
          this.router.navigate(['/cart']);
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.isLoading = false;
        this.router.navigate(['/cart']);
      }
    });
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (!this.cart || this.cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    this.isSubmitting = true;

    const orderData = {
      address: {
        governate: this.checkoutForm.value.governate,
        city: this.checkoutForm.value.city,
        addressDetails: this.checkoutForm.value.addressDetails,
      },
      phone: this.checkoutForm.value.phone,
      items: this.cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        priceAtOrder: item.productId.price,
      })),
      totalPrice: this.cart.totalPrice,
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        alert('Order placed successfully!');
        
        this.cartService.clearCart().subscribe();
        
        this.router.navigate(['/order-success', res.data._id]);
      },
      error: (err) => {
        console.error('Error placing order:', err);
        this.isSubmitting = false;
        alert('Failed to place order. Please try again.');
      }
    });
  }

  getItemSubtotal(item: any): number {
    return item.productId.price * item.quantity;
  }
  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}
