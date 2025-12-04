import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../cores/services/auth-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
loginForm: FormGroup = new FormGroup({
  email: new FormControl(''),
  password:new FormControl('')
});
constructor(private _authService:AuthService,private router:Router){}
login(){
  this._authService.login(this.loginForm.value).subscribe(
  {
    next: (data)=>{
       console.log(data)
      
    },
    error: (err)=> {
      console.log(err);
    },
  }
);
  
}
}
