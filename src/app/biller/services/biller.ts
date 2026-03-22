import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse } from '../../core/models/global';
import { Observable } from 'rxjs';
import { BillerData, BillerRequest, BillerResponse } from '../models/biller';
import { SalesFilters } from '../../sales/models/sales';

@Injectable({
  providedIn: 'root',
})
export class BillerService {
  private apiUrl = 'https://orby-engine.fly.dev/api/biller';

  constructor(private http: HttpClient) {}

  getBillerData(): Observable<ApiResponse<BillerData>> {
    return this.http.get<ApiResponse<BillerData>>(`${this.apiUrl}/data`);
  }

  registerSale(billerRequest: BillerRequest): Observable<ApiResponse<BillerResponse>> {
    return this.http.post<ApiResponse<BillerResponse>>(this.apiUrl, billerRequest);
  }

  getSales(filters?: SalesFilters): Observable<ApiResponse<any>> {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/sales`, { params });
  }
}
