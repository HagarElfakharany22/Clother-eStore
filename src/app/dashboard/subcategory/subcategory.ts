import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubCategory } from '../../cores/services/sub-category';
import { ISubCategory } from '../../cores/models/subCat.model';

@Component({
  selector: 'app-subcategory',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './subcategory.html',
  styleUrl: './subcategory.css',
})
export class Subcategory implements OnInit {
  subCategories!: ISubCategory[];
  filteredsubCategories: ISubCategory[]=[];
  showModal = false;
  isEditMode = false;
  isLoading = false;
  searchTerm = '';
  selectedCategoryId: string | null = null;
  constructor(private subCategoryService: SubCategory) { }
  subCategoryForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators['required']),
    slug: new FormControl('', Validators['required']),
    categoryId: new FormControl('', Validators['required']),
     isActive: new FormControl (true)
  });
  ngOnInit(): void {
    this.loadSubCategories();
  }
  loadSubCategories(): void {
    this.isLoading = true;
    this.subCategoryService.getAllSubCategories().subscribe({
      next: (res) => {
        this.subCategories = res.data;
        this.filteredsubCategories = res.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading = false;
        alert('Failed to load categories');
      }
    })
  }
  //for search
  filterSubCategory(): void {
    if (!this.searchTerm.trim()) {
      this.filteredsubCategories = this.subCategories;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredsubCategories = this.subCategories.filter(sub =>
      sub.name.toLowerCase().includes(term) ||
      sub.slug.toLowerCase().includes(term)
    )
  }
  // Generate slug from name
  generateSlug(): void {
    const name = this.subCategoryForm.get('name')?.value;
    if (name) {
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      this.subCategoryForm.patchValue({ slug });
    }
  }
  
  openAddModal(): void {
    this.isEditMode = false;
    this.subCategoryForm.reset();
    this.showModal = true;
  }
  openEditModal(subCategory: ISubCategory): void {
    this.isEditMode = true;
    this.selectedCategoryId = subCategory._id;
    this.subCategoryForm.patchValue({
      name: subCategory.name,
      slug: subCategory.slug,
      categoryId: subCategory.category._id,
       isActive: subCategory.isActive
    });
    this.showModal = true;
  }
  // Close modal
  closeModal(): void {
    this.showModal = false;
    this.subCategoryForm.reset();
    this.selectedCategoryId = null;
  }
  submitForm(): void {
    if (this.subCategoryForm.invalid) {
      this.subCategoryForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const formData = this.subCategoryForm.value;
    if (this.isEditMode && this.selectedCategoryId) {
      this.subCategoryService.updateSubCategory(this.selectedCategoryId, formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.closeModal();
          this.loadSubCategories();
          alert(response.message || 'Category updated successfully!');
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.isLoading = false;
          alert('Failed to update category');
        }
      })
    }
    else {
      // Add new category
      this.subCategoryService.addSubCategory(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.closeModal();
          this.loadSubCategories();
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
  deletesubCategory(id: string): void {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    this.isLoading = true;
    this.subCategoryService.deleteSubCategory(id).subscribe({
      next: () => {
        this.isLoading = false;
        this.loadSubCategories();
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
