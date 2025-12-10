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
    this.loadPaginatedProducts();
  }

  loadPaginatedProducts() {
    this.isLoading = true;
    this.productService.getProducts(this.currentPage, this.itemsPerPage).subscribe({
      next: (res) => {
      
        this.allProducts = res.results;
        this.totalPages = res.totalPages;
        this.currentPage = res.page;
        
        this.applyFilters();

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading = false;
      }
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

  applyFilters(): void {
    this.displayedProducts = [...this.allProducts];

    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      this.displayedProducts = this.displayedProducts.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
    }

    if (this.selectedCategory) {
      this.displayedProducts = this.displayedProducts.filter(
        p => p.Category?.slug === this.selectedCategory
      );
    }

    if (this.selectedSubcategory) {
      this.displayedProducts = this.displayedProducts.filter(
        p => p.subCategory?.slug === this.selectedSubcategory
      );
    }

    if (this.minPrice !== undefined) {
      this.displayedProducts = this.displayedProducts.filter(
        p => p.price >= this.minPrice!
      );
    }

    if (this.maxPrice !== undefined) {
      this.displayedProducts = this.displayedProducts.filter(
        p => p.price <= this.maxPrice!
      );
    }
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedSubcategory = '';
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.searchTerm = '';
    this.subcategories = [];
    this.currentPage = 1;
    this.loadPaginatedProducts(); 
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPaginatedProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage() { this.goToPage(this.currentPage - 1); }
  nextPage() { this.goToPage(this.currentPage + 1); }

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

