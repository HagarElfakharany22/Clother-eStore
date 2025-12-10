import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../cores/models/product.model';
import { environment } from '../../environments/environment';
import { ProductService } from '../../cores/services/product-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../cores/services/cart-service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule,FormsModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit{
constructor(private _activeRoute: ActivatedRoute,private _productService:ProductService,private _cartService:CartService){}
product!:IProduct;
quantity=1;
staticURL = environment.staticFilesURL;
slug!:string | null;
ngOnInit(): void {
 this.slug =  this._activeRoute.snapshot.paramMap.get('slug');
  if(this.slug){ 

    this._productService.getProductBySlug(this.slug).subscribe(res=>{
    this.product=res.data
    console.log(res.data);
    
   })
  
  }
}
addToCart(){
  if (!this.product) return;
     this._cartService.addToCart({
    productId:this.product._id,
    imgURL:this.product.imgURL,
    name:this.product.name,
    price:this.product.price,
    quantity: this.quantity
  }).subscribe({
    next: (res) => {
      console.log("Added:", res);
    },
    error: (err) => {
      alert("fail to add")
      console.log(err);
    }
  })
}
  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
