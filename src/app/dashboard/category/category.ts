import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categoryservice } from '../../cores/services/categoryservice';
import { CommonModule } from '@angular/common';
import { ICategory } from '../../cores/models/category.model';

@Component({
  selector: 'app-category',
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category {
  categories!: ICategory[] 
  filteredCategories!: ICategory[] 
  showModal = false;
  isEditMode = false;
  isLoading = false;
  searchTerm = '';
  selectedCategoryId: string | null = null;

  constructor(private categoryService: Categoryservice) { }
  categoryForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    slug: new FormControl(''),
      isActive: new FormControl (true)
  });
  ngOnInit(): void {
    this.loadCategories();
  }

  // Load all categories
  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        
        this.categories = response.data;
        this.filteredCategories = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading = false;
        alert('Failed to load categories');
      }
    });
  }

  // Filter categories based on search term
  filterCategories(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCategories = this.categories;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredCategories = this.categories.filter(category =>
      category.name.toLowerCase().includes(term) ||
      category.slug.toLowerCase().includes(term)
    );
  }

  // Generate slug from name
  generateSlug(): void {
    const name = this.categoryForm.get('name')?.value;
    if (name) {
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      this.categoryForm.patchValue({ slug });
    }
  }

  // Open modal for adding new category
  openAddModal(): void {
    this.isEditMode = false;
    this.categoryForm.reset();
    this.showModal = true;
  }

  // Open modal for editing category
  openEditModal(category: ICategory): void {
    this.isEditMode = true;
    this.selectedCategoryId = category._id;
    this.categoryForm.patchValue({
      name: category.name,
      slug: category.slug,
      isActive: category.isActive
    });
    this.showModal = true;
  }

  // Close modal
  closeModal(): void {
    this.showModal = false;
    this.categoryForm.reset();
    this.selectedCategoryId = null;
  }

  // Submit form (add or update)
  submitForm(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.categoryForm.value;

    if (this.isEditMode && this.selectedCategoryId) {
      // Update category
      this.categoryService.updateCategory(this.selectedCategoryId, formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.closeModal();
          this.loadCategories();
          alert(response.message || 'Category updated successfully!');
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.isLoading = false;
          alert('Failed to update category');
        }
      });
    } else {
      // Add new category
      this.categoryService.addCategory(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.closeModal();
          this.loadCategories();
          alert(response.message || 'Category added successfully!');
        },
        error: (error) => {
          console.error('Error adding category:', error);
          this.isLoading = false;
          alert('Failed to add category');
        }
      });
    }
  }

  // Delete category
  deleteCategory(id: string): void {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    this.isLoading = true;
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.isLoading = false;
        this.loadCategories();
        alert('Category deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.isLoading = false;
        alert('Failed to delete category');
      }
    });
  }
}
