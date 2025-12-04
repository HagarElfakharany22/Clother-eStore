import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TestmonService } from '../../cores/services/testmon-service';

@Component({
  selector: 'app-test-mon',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './test-mon.html',
  styleUrl: './test-mon.css',
})
export class TestMon {
  constructor(private _testMonServ:TestmonService){}
testimonialForm:FormGroup  = new FormGroup({
      name: new FormControl ('', Validators.required),
      message:new FormControl ('', Validators.required),
      rating: new FormControl ('', [Validators.required, Validators.max(5)]),
    });
    onSubmit() {
    if (this.testimonialForm.valid) {
      this._testMonServ.addTestimonials(this.testimonialForm.value).subscribe({
        next: (res) => {
          alert('Testimonial added successfully!');
          this.testimonialForm.reset();
        },
        error: (err) => {
          console.error(err);
          alert('Error adding testimonial');
        }
      });
    } else {
      alert('Please fill all required fields correctly!');
    }
  }
}
