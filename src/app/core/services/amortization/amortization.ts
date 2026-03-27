import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Amortization, AmortizationRequest } from '../../models/amortization';
import { ApiResponse } from '../../models/global';

@Injectable({
  providedIn: 'root',
})
export class AmortizationService {
  private apiUrl = 'https://orby-engine.fly.dev/api/payments/';

  constructor(private http: HttpClient) {}

  getAmortizations(paymentId: number): Observable<ApiResponse<Amortization[]>> {
    return this.http.get<ApiResponse<Amortization[]>>(`${this.apiUrl}${paymentId}/amortizations`);
  }

  createAmortization(
    paymentId: number,
    data: AmortizationRequest,
  ): Observable<ApiResponse<Amortization>> {
    return this.http.post<ApiResponse<Amortization>>(
      `${this.apiUrl}${paymentId}/amortizations`,
      data,
    );
  }
}
