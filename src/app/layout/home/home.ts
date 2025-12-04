import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../cores/services/report-service';
import { IProduct } from '../../cores/models/product.model';
import { TopProduct } from '../../cores/models/report.model';
import { ProductService } from '../../cores/services/product-service';
import { environment } from '../../environments/environment';
import { TestmonService } from '../../cores/services/testmon-service';
import { Itestimonails } from '../../cores/models/testimonial.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  constructor(private reportService: ReportService, private _productService: ProductService,private _testmon:TestmonService) { }
  bestSellers: TopProduct[] = [];
  newArrivals:IProduct[]=[];
  testMonials:Itestimonails[]=[];
  uploadUrl=environment.staticFilesURL;
  ngOnInit(): void {
    this.reportService.getOrderReport().subscribe({
      next: (res) => {
        const data = res.data[0];

        this.bestSellers = data.topProducts;
        console.log(this.bestSellers)
      }
    });
    this._productService.getAllProducts().subscribe({
       next: (res) => {
       this.newArrivals=res.data
      }
    });
    this._testmon.getATestmonials().subscribe({
      next:(res)=>{
        this.testMonials=res.data;
      }
    })
  }
}
