import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../cores/services/product-service';
import { Categoryservice } from '../../cores/services/categoryservice';
import { SubCategory } from '../../cores/services/sub-category';
import { IProduct } from '../../cores/models/product.model';
import { ISubCategory } from '../../cores/models/subCat.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ICategory, IsubCategory } from '../../cores/models/category.model';
import { CartService } from '../../cores/services/cart-service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
 allProducts: IProduct[] = []; 
  displayedProducts: IProduct[] = []; 
  uploadUrl = environment.staticFilesURL;
filteredProducts: IProduct[] = [];
  categories: ICategory[] = [];
  subcategories: IsubCategory[] = [];

  selectedCategory = '';
  selectedSubcategory = '';
  minPrice: number | undefined;
  maxPrice: number | undefined;
  searchTerm = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 4;
  totalPages = 0;

  isLoading = false;

  constructor(
    private productService: ProductService,
    private categoryService: Categoryservice,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
   this.loadAllProducts();
  }

  // loadPaginatedProducts() {
  //   this.isLoading = true;
  //   this.productService.getProducts(this.currentPage, this.itemsPerPage).subscribe({
  //     next: (res) => {
  //       this.allProducts = res.results;
  //       this.totalPages = res.totalPages;
  //       this.currentPage = res.page;

      
  //       this.applyFilters();

  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error('Error loading products:', err);
  //       this.isLoading = false;
  //     }
  //   });
  // }
  loadAllProducts() {
  this.productService.getAllProducts().subscribe({
    next: (res) => {
      this.allProducts = res.data;
      this.applyFilters();
    },
    error: (err) => console.log(err)
  });
}

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  onCategoryChange(): void {
    this.selectedSubcategory = '';
    this.subcategories = [];

    if (this.selectedCategory) {
      this.categoryService.getCategoryBySlug(this.selectedCategory).subscribe({
        next: (res) => {
          this.subcategories = res.data.subCategories || [];
        },
        error: (err) => console.error('Error loading subcategories:', err)
      });
    }

    this.applyFilters();
  }

 applyFilters() {
  let data = [...this.allProducts];

  // Search
  if (this.searchTerm.trim()) {
    const search = this.searchTerm.toLowerCase();
    data = data.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.description?.toLowerCase().includes(search)
    );
  }

  // Category
  if (this.selectedCategory) {
    data = data.filter(
      p => p.Category?.slug === this.selectedCategory
    );
  }

  // Subcategory
  if (this.selectedSubcategory) {
    data = data.filter(
      p => p.subCategory?.slug === this.selectedSubcategory
    );
  }

  // Price
  if (this.minPrice != undefined) {
    data = data.filter(p => p.price >= this.minPrice!);
  }

  if (this.maxPrice != undefined) {
    data = data.filter(p => p.price <= this.maxPrice!);
  }

  this.filteredProducts = data;
  this.updatePagination();
}
updatePagination() {
  this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);

  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;

  this.displayedProducts = this.filteredProducts.slice(start, end);
}
  
clearFilters() {
  this.selectedCategory = '';
  this.selectedSubcategory = '';
  this.minPrice = undefined;
  this.maxPrice = undefined;
  this.searchTerm = '';
  this.currentPage = 1;
  this.applyFilters();
}

goToPage(page: number) {
  this.currentPage = page;
  this.updatePagination();
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.updatePagination();
  }
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updatePagination();
  }
}

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSearch(): void {
  
    this.applyFilters();
  }

  addToCart(product: IProduct) {
    this.cartService.addToCart({
      productId: product._id,
      name: product.name,
      imgURL: product.imgURL,
      price: product.price,
      quantity: 1
    }).subscribe({
      next: (res) => {
        console.log("Added:", res);
        alert('Added to cart successfully!');
      },
      error: (err) => {
        console.log(err);
        alert('Failed to add to cart');
      }
    });
  }
}

