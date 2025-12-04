import { Component, OnInit } from '@angular/core';
import { IOrder } from '../../cores/models/orders.model';
import { OrderService } from '../../cores/services/order-service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
 orders: IOrder[] = [];
  filteredOrders: IOrder[] = [];
  
  showStatusModal = false;
  showDetailsModal = false;
  isLoading = false;
  searchTerm = '';
  
  selectedOrder: IOrder | null = null;
  selectedStatus = '';
  
  // Status options
  statusOptions = [
    { value: 'pending', label: 'Pending', color: '#feebc8' },
    { value: 'prepared', label: 'Prepared', color: '#bee3f8' },
    { value: 'shipped', label: 'Shipped', color: '#c6f6d5' },
    { value: 'recieved', label: 'Received', color: '#9ae6b4' },
    { value: 'returned', label: 'Returned', color: '#fed7d7' },
    { value: 'refund', label: 'Refund', color: '#fbb6ce' },
    { value: 'refused', label: 'Refused', color: '#fc8181' },
  ];

  constructor(
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // Load all orders
  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res.data;
        this.filteredOrders = res.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
        alert('Failed to load orders');
      }
    });
  }

  // Filter orders
  filterOrders(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOrders = this.orders;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredOrders = this.orders.filter(order =>
      order._id.toLowerCase().includes(term) ||
      order.user?.name?.toLowerCase().includes(term) ||
      order.phone.toLowerCase().includes(term) ||
      order.orderStatus.toLowerCase().includes(term)
    );
  }

  filterByStatus(status: string): void {
    if (status === 'all') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => order.orderStatus === status);
    }
    this.searchTerm = '';
  }

 
  openStatusModal(order: IOrder): void {
    this.selectedOrder = order;
    this.selectedStatus = order.orderStatus;
    this.showStatusModal = true;
  }


  closeStatusModal(): void {
    this.showStatusModal = false;
    this.selectedOrder = null;
    this.selectedStatus = '';
  }

  // Change order status
  changeStatus(): void {
    if (!this.selectedOrder || !this.selectedStatus) return;

    this.isLoading = true;
    this.orderService.changeOrderStatus(this.selectedOrder._id, this.selectedStatus).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.closeStatusModal();
        alert(response.message || 'Status updated successfully!');
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error changing status:', error);
        this.isLoading = false;
        alert('Failed to change status');
      }
    });
  }

  openDetailsModal(order: IOrder): void {
    this.selectedOrder = order;
    this.showDetailsModal = true;
  }

  // Close details modal
  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedOrder = null;
  }

  // Get status color
  getStatusColor(status: string): string {
    const statusObj = this.statusOptions.find(s => s.value === status);
    return statusObj?.color || '#e2e8f0';
  }

  // Get total items count
  getTotalItems(order: IOrder): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }
}
