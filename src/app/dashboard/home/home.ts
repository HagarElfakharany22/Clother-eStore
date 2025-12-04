import { Component, OnInit } from '@angular/core';
import { OrderReport } from '../../cores/models/report.model';
import { ReportService } from '../../cores/services/report-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule,FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
report: OrderReport = {
  overallStats:[],
  orderStatusStats: [],
  topProducts: [],
  topUsers: []
};
constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport() {
    this.reportService.getOrderReport().subscribe({
      next: (res) => {
        const data = res.data[0]; 
      console.log(data.overallStats[0])
        this.report = {
          overallStats: data.overallStats|| { totalOrders: 0, totalRevenue: 0, totalItemsSold: 0 },
          orderStatusStats: data.orderStatusStats || [],
          topProducts: data.topProducts || [],
          topUsers: data.topUsers || []
        };
      },
      error: (err) => console.error(err)
    });
  }
}
