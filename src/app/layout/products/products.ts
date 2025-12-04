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
  uploadUrl=environment.staticFilesURL;
  filteredProducts: IProduct[] = [];
  
  displayedProducts: IProduct[] = [];
  
  categories: ICategory[] = [];
  subcategories: IsubCategory[] = [];
  
  selectedCategory = '';
  selectedSubcategory = '';
  minPrice: number | undefined;
  maxPrice: number | undefined;
  searchTerm = '';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 0;
  
  isLoading = false;

  constructor(
    private productService: ProductService,
    private categoryService: Categoryservice,
    private _cartService:CartService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllProducts();
  }

  loadAllProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        // console.log(res.data);
        
        this.allProducts = res.data;
        // this.filteredProducts=res.data;
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
          console.log(res.data.slug )
          this.subcategories = res.data.subCategories || [];
          // console.log();
          
        },
        error: (err) => console.error('Error loading subcategories:', err)
      });
    }
    
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProducts = this.allProducts;
console.log(this.filteredProducts);

    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      this.filteredProducts = this.filteredProducts.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
    }

    if (this.selectedCategory) {
      console.log("selesctaed vate",this.selectedCategory);
      
      this.filteredProducts = this.filteredProducts.filter(
        p => p.Category.slug === this.selectedCategory
      );
    //  console.log("after cate",this.filteredProducts)
      
    //   this.filteredProducts.forEach(it=>console.log(it)
    //   )
      console.log("after cate",this.filteredProducts)
    }

    if (this.selectedSubcategory) {
      console.log("selectedSubcategory",this.selectedSubcategory)
      console.log("filerdProd",this.filteredProducts);
      
        // this.filteredProducts.forEach(fil=>console.log(fil.subCategory.slug)
        //  )
  this.filteredProducts = this.filteredProducts.filter(
    p => p.subCategory?.slug === this.selectedSubcategory
  );


    }

    if (this.minPrice !== undefined) {
      this.filteredProducts = this.filteredProducts.filter(
        p => p.price >= this.minPrice!
      );
    }

    if (this.maxPrice !== undefined) {
      this.filteredProducts = this.filteredProducts.filter(
        p => p.price <= this.maxPrice!
      );
    }

    this.calculatePagination();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedSubcategory = '';
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.searchTerm = '';
    this.subcategories = [];
    this.currentPage = 1;
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.calculatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll للأعلى
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSearch(): void {
    this.currentPage = 1; 
    this.applyFilters();
  }
  addToCart(id:string){
     this._cartService.addToCart({
    productId: id,
    quantity: 1
  }).subscribe({
    next: (res) => {
      console.log("Added:", res);
    },
    error: (err) => {
      console.log(err);
    }
  })
}
}

