import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../cores/services/auth-service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  constructor(private _auth: AuthService) { }
  name = '';
   sidebarOpen = false;
  ngOnInit(): void {
    this._auth.getUserData().subscribe((data) => {
      if (data) {
        this.name = data.name;
        console.log(this.name);
      }
      else {
        this.name = '';
      }
    })

  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
