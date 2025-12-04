import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestmonService } from '../../cores/services/testmon-service';
import { Itestimonails } from '../../cores/models/testimonial.model';

@Component({
  selector: 'app-testimonial',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './testimonial.html',
  styleUrl: './testimonial.css',
})
export class Testimonial {
  newTestimonials: Itestimonails[] = [];
  oldTestimonials: Itestimonails[] = [];
  filteredTestimonials: Itestimonails[] = [];
  ishidden = false;
  isLoading = false;
  searchTerm = '';
  activeTab: 'new' | 'old' = 'new';
  constructor(private testimonialService: TestmonService) { }

  ngOnInit(): void {
    this.loadNewTestimonials();
  }

 // Load New Testimonials
  loadNewTestimonials(): void {
    this.isLoading = true;
    this.activeTab = 'new';
    this.testimonialService.getNewTestimonials().subscribe({
      next: (res) => {
        this.newTestimonials = res.data;
        this.filteredTestimonials = res.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading new testimonials:', error);
        this.isLoading = false;
        alert('Failed to load new testimonials');
      }
    });
  }

  // Load Old Testimonials
  loadOldTestimonials(): void {
    this.isLoading = true;
    this.activeTab = 'old';
    this.testimonialService.getOldTestimonials().subscribe({
      next: (res) => {
        this.oldTestimonials = res.data;
        this.filteredTestimonials = res.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading old testimonials:', error);
        this.isLoading = false;
        alert('Failed to load old testimonials');
      }
    });
  }

  // Filter testimonials based on search term
  filterTestimonials(): void {
    const sourceData = this.activeTab === 'new' ? this.newTestimonials : this.oldTestimonials;
    
    if (!this.searchTerm.trim()) {
      this.filteredTestimonials = sourceData;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredTestimonials = sourceData.filter(testimonial =>
      testimonial.user._id.toLowerCase().includes(term) ||
      testimonial.message.toLowerCase().includes(term) ||
      testimonial.status.toLowerCase().includes(term)
    );
  }

  // Approve Testimonial
  approveTestimonial(id: string): void {
    if (!confirm('Are you sure you want to approve this testimonial?')) {
      return;
    }

    this.isLoading = true;
    this.testimonialService.approveTestmonials(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert(response.message || 'Testimonial approved successfully!');
        this.loadNewTestimonials();
      },
      error: (error) => {
        console.error('Error approving testimonial:', error);
        this.isLoading = false;
        alert('Failed to approve testimonial');
      }
    });
  }

  // Hide Testimonial
  hideTestimonial(id: string): void {
    if (!confirm('Are you sure you want to hide this testimonial?')) {
      return;
    }

    this.isLoading = true;
    this.testimonialService.hideTestmonials(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert(response.message || 'Testimonial hidden successfully!');
        if (this.activeTab === 'new') {
          this.loadNewTestimonials();
        } else {
          this.loadOldTestimonials();
        }
      },
      error: (error) => {
        console.error('Error hiding testimonial:', error);
        this.isLoading = false;
        alert('Failed to hide testimonial');
      }
    });
  }

  // Switch between tabs
  switchTab(tab: 'new' | 'old'): void {
    this.searchTerm = '';
    if (tab === 'new') {
      this.loadNewTestimonials();
    } else {
      this.loadOldTestimonials();
    }
  }
}
