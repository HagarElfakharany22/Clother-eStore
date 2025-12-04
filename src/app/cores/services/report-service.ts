import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { OrderReportRes } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private _http:HttpClient){}
  apiURL=environment.apiURL+"/report";
  getOrderReport() {
    return this._http.get<OrderReportRes>(this.apiURL);
  }
}
