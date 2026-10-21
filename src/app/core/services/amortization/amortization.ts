import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Amortization, AmortizationRequest } from '../../models/amortization';
import { ApiResponse } from '../../models/global';
import { API_BASE_URL } from '../../constants/global';

@Injectable({
  providedIn: 'root',
})
export class AmortizationService {
  private readonly apiUrl = `${API_BASE_URL}/payments/`;

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
