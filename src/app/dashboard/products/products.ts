import { Component } from '@angular/core';
import { ProductService } from '../../cores/services/product-service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProduct } from '../../cores/models/product.model';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  products!: IProduct[];
  uploadUrl=environment.staticFilesURL;
  filteredProducts: IProduct[]=[];
  showModal = false;
  isEditMode = false;
  isLoading = false;
  searchTerm = '';
  selectedProductId: string | null = null;
  selectedFile: File | null = null;
  selectedFileName = '';
  // imagePreview: string | null = null;
productForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    stock: new FormControl('', [Validators.required, Validators.min(0)]),
    slug: new FormControl('', Validators.required),
    categoryId: new FormControl('', Validators.required),
    subCategoryId: new FormControl('', Validators.required),
    isActive: new FormControl(true),
    imgURL: new FormControl(null)
  });

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        console.log(res);
        
        this.products = res.data;
        this.filteredProducts = res.data;
         this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
        alert('Failed to load products');
      }
    });
  }

  filterProducts(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = this.products;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.slug.toLowerCase().includes(term)
    );
  }

  generateSlug(): void {
    const name = this.productForm.get('name')?.value;
    if (name) {
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      this.productForm.patchValue({ slug });
    }
  }

  onFileSelected(event: Event): void {
    console.log(event);

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      this.productForm.patchValue({
        imgURL: this.selectedFile,
      });
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.productForm.reset({ isActive: true });
    this.selectedFile = null;
    this.selectedFileName = '';
    this.showModal = true;
  }

  openEditModal(product: IProduct): void {
    this.isEditMode = true;
    this.selectedProductId = product._id;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      slug: product.slug,
      categoryId: product.Category,
      subCategoryId: product.subCategory,
      isActive: product.isActive
    });
    this.selectedFileName = product.imgURL;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.productForm.reset();
    this.selectedProductId = null;
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  submitForm(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    if (!this.isEditMode && !this.selectedFile) {
      alert('Please select an image for the product');
      return;
    }

    this.isLoading = true;
    
   
    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('description', this.productForm.get('description')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('stock', this.productForm.get('stock')?.value);
    formData.append('slug', this.productForm.get('slug')?.value);
    formData.append('categoryId', this.productForm.get('categoryId')?.value);
    formData.append('subCategoryId', this.productForm.get('subCategoryId')?.value);
    
    if (this.selectedFile) {
      formData.append('img', this.selectedFile);
    }

    if (this.isEditMode && this.selectedProductId) {
      // Update product
      this.productService.updateProduct(this.selectedProductId, formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.closeModal();
          this.loadProducts();
          alert(response.message || 'Product updated successfully!');
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.isLoading = false;
          alert('Failed to update product');
        }
      });
    } else {
      // Add new product
      this.productService.addProduct(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.closeModal();
          this.loadProducts();
          alert(response.message || 'Product added successfully!');
        },
        error: (error) => {
          console.error('Error adding product:', error);
          this.isLoading = false;
          alert('Failed to add product');
        }
      });
    }
  }

  deleteProduct(id: string): void {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    this.isLoading = true;
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.isLoading = false;
        this.loadProducts();
        alert('Product deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.isLoading = false;
        alert('Failed to delete product');
      }
    });
  }
}
