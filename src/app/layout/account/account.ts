import { Component, OnInit } from '@angular/core';
import { Iuser, IUserResponse } from '../../cores/models/user.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../cores/services/user-service';
import { Router } from '@angular/router';
import { AuthService } from '../../cores/services/auth-service';

@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {
  user: Iuser | null = null;
  isLoading = false;
  isSubmitting = false;
   userId:string| undefined='';
  editForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required])
  });

  constructor(
    private userService: UserService,
    private router: Router,
   private _auth:AuthService
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.isLoading = true;
  this._auth.getUserData().subscribe({
    next:(res)=>{
     this.userId=res?.id;
     
    },
    error:(err)=>{
      
    }
  })
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getUser(this.userId).subscribe({
      next: (res: IUserResponse) => {
        this.user = res.data;
        this.editForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          phone: this.user.phone
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  saveChanges(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    if (!this.user) return;

    this.isSubmitting = true;

    this.userService.updateUserInfo(this.user._id, this.editForm.value).subscribe({
      next: (res: IUserResponse) => {
        this.user = res.data;
        this.isSubmitting = false;
        alert('Profile updated successfully!');
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        alert('Failed to update profile.');
      }
    });
  }

  deleteAccount(): void {
    if (!this.user) return;
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

    this.userService.deleteUser(this.user._id).subscribe({
      next: () => {
        alert('Account deleted successfully.');
        localStorage.clear();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to delete account.');
      }
    });
  }
}
