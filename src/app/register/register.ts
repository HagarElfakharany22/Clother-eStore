import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PasswordValidators } from '../cores/validators/password.validator';
import { UserService } from '../cores/services/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  constructor(private _userService:UserService ,private _router:Router){}
  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, PasswordValidators.StrongPassword()]),
      confirmPassword: new FormControl('', [Validators.required, PasswordValidators.matchPassword()]),
      phone: new FormControl(''),
      address: new FormGroup({
        governate: new FormControl(''),
        city: new FormControl(''),
        detailedAddress: new FormControl('', Validators.maxLength(200)),
      })
    })
  }
  registerForm!: FormGroup;
  isduplicated=false;
  onSubmit() {
   this._userService.Register(this.registerForm.value).subscribe({
    next: (res) => {
      console.log("User registered", res);
      this._router.navigate(['/login']);
    },
    error: (err) => {
      console.log("Error:", err);
      if (err.error && typeof err.error.error === 'string') {
        console.log(err.error.error);
        
      if (err.error.error.toLowerCase().includes('duplicate')) {
        this.isduplicated = true;
      }
    }
    }
  });
   
  }
}
