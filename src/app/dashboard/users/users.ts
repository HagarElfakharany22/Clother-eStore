import { Component } from '@angular/core';
import { Iuser } from '../../cores/models/user.model';
import { UserService } from '../../cores/services/user-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [CommonModule,FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
users: Iuser[] = [];
  filteredUsers: Iuser[] = [];
  showModal = false;
  isLoading = false;
  searchTerm = '';
  filterRole = '';
  filterBlocked = '';
  selectedUser: Iuser | null = null;
  blockedCount = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.data;
        this.filteredUsers = res.data;
        this.calculateBlockedCount();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
        alert('Failed to load users');
      }
    });
  }

  calculateBlockedCount(): void {
    this.blockedCount = this.users.filter(user => user.isBlocked).length;
  }

  filterUsers(): void {
    let filtered = this.users;

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.toLowerCase().includes(term)
      );
    }

   

    // Filter by blocked status
    if (this.filterBlocked) {
      const isBlocked = this.filterBlocked === 'true';
      filtered = filtered.filter(user => user.isBlocked === isBlocked);
    }

    this.filteredUsers = filtered;
  }

  toggleBlockUser(user: Iuser): void {
    const action = user.isBlocked ? 'unblock' : 'block';
    const confirmMessage = `Are you sure you want to ${action} ${user.name}?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    this.isLoading = true;
    this.userService.toggleBlockUser(user._id, !user.isBlocked).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Update the user in the list
        const index = this.users.findIndex(u => u._id === user._id);
        if (index !== -1) {
          this.users[index].isBlocked = !user.isBlocked;
        }
        
        if (this.selectedUser && this.selectedUser._id === user._id) {
          this.selectedUser.isBlocked = !user.isBlocked;
        }
        
        this.calculateBlockedCount();
        this.filterUsers();
        alert(response.message || `User ${action}ed successfully!`);
      },
      error: (error) => {
        console.error(`Error ${action}ing user:`, error);
        this.isLoading = false;
        alert(`Failed to ${action} user`);
      }
    });
  }

  viewUser(user: Iuser): void {
    this.selectedUser = { ...user };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedUser = null;
  }
}
