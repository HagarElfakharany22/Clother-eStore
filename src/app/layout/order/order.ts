import { Component, OnInit } from '@angular/core';
import { IOrder } from '../../cores/models/orders.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../cores/services/order-service';
import { environment } from '../../environments/environment';
import { CartService } from '../../cores/services/cart-service';

@Component({
  selector: 'app-order',
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order implements OnInit {
  orders: IOrder[] = [];
  filteredOrders: IOrder[] = [];
  uploadUrl=environment.staticFilesURL;
  
  showDetailsModal = false;
  showEditModal = false;
  selectedOrder: IOrder | null = null;
  editForm!: FormGroup;
  
  isLoading = false;
  searchTerm = '';
  selectedStatus = '';

  // Status colors
  statusColors: any = {
    pending: '#feebc8',
    prepared: '#bee3f8',
    shipped: '#c6f6d5',
    recieved: '#9ae6b4',
    returned: '#fed7d7',
    refund: '#fbb6ce',
    refused: '#fc8181',
    canceled: '#e2e8f0',
  };

  constructor(
    private orderService: OrderService,
    private cartService:CartService
  ) {
    this.editForm =new FormGroup({
      governate:new FormControl ('', Validators.required),
      city: new FormControl ('', Validators.required),
      addressDetails:new FormControl ('', Validators.required),
      phone: new FormControl ('', Validators.required),
    });
  }

  ngOnInit(): void {
    
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        this.orders = res.data;
        this.filteredOrders = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.isLoading = false;
        alert('Failed to load orders');
      }
    });
  }

  filterOrders(): void {
    this.filteredOrders = this.orders;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      this.filteredOrders = this.filteredOrders.filter(order =>
        order._id.toLowerCase().includes(term) ||
        order.phone.toLowerCase().includes(term)
      );
    }

    if (this.selectedStatus) {
      this.filteredOrders = this.filteredOrders.filter(
        order => order.orderStatus === this.selectedStatus
      );
    }
  }

  openDetailsModal(order: IOrder): void {
    this.selectedOrder = order;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedOrder = null;
  }

  openEditModal(order: IOrder): void {
    this.selectedOrder = order;
    
    this.editForm.patchValue({
      governate: order.address.governate,
      city: order.address.city,
      addressDetails: order.address.addressDetails,
      phone: order.phone,
    });
    
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedOrder = null;
    this.editForm.reset();
  }

  canEdit(order: IOrder): boolean {
    return order.orderStatus === 'pending' || order.orderStatus === 'prepared';
  }

  saveChanges(): void {
    if (this.editForm.invalid || !this.selectedOrder) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const updates = {
      address: {
        governate: this.editForm.value.governate,
        city: this.editForm.value.city,
        addressDetails: this.editForm.value.addressDetails,
      },
      phone: this.editForm.value.phone,
    };

    this.orderService.updateOrder(this.selectedOrder._id, updates).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.closeEditModal();
        alert('Order updated successfully!');
        this.loadOrders();
      },
      error: (err) => {
        console.error('Error updating order:', err);
        this.isLoading = false;
        
        const errorMsg = err.error?.message || "Can't update order";
        alert(errorMsg);
      }
    });
  }

  cancelOrder(order: IOrder): void {
    if (order.orderStatus !== 'pending') {
      alert("You can only cancel pending orders");
      return;
    }

    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    this.isLoading = true;
    
    this.orderService.updateOrder(order._id, { orderStatus: 'canceled' }).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Order canceled successfully!');
        this.loadOrders();
      },
      error: (err) => {
        console.error('Error canceling order:', err);
        this.isLoading = false;
        alert('Failed to cancel order');
      }
    });
  }

  getStatusColor(status: string): string {
    return this.statusColors[status] || '#e2e8f0';
  }
  getItemSubtotal(item: any): number {
    return item.priceAtOrder * item.quantity;
  }

  getTotalItems(order: IOrder): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }
  requestRefund(order: IOrder): void {
    console.log(order.orderStatus);
    
  if (order.orderStatus !== 'recieved') {
    alert("You can only request a refund after receiving the order");
    return;
  }

  if (!confirm("Are you sure you want to request a refund for this order?")) return;

  this.isLoading = true;
  this.orderService.updateOrder(order._id, { orderStatus: 'request refund' }).subscribe({
    next: (res) => {
      this.isLoading = false;
      alert(res.message || 'Refund requested successfully!');
      this.loadOrders();
    },
    error: (err) => {
      this.isLoading = false;
      console.error('Error requesting refund:', err);
      alert(err.error?.message || 'Failed to request refund');
    }
  });
}

}