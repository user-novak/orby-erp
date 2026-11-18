import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/constants/global';
import { PaginatedResponse } from '../../core/models/global';
import {
  AccountMovement,
  AccountMovementFilters,
  AccountPaymentRequest,
  AccountMovementRequest,
  AccountMovementResourceResponse,
} from '../models/account-movement';

@Injectable({
  providedIn: 'root',
})
export class AccountMovementService {
  private readonly apiUrl = `${API_BASE_URL}/account-movements`;

  constructor(private readonly http: HttpClient) {}

  createAccountMovement(
    movement: AccountMovementRequest,
  ): Observable<AccountMovementResourceResponse> {
    return this.http.post<AccountMovementResourceResponse>(this.apiUrl, movement);
  }

  getAccountMovements(
    page = 1,
    perPage = 5,
    filters?: AccountMovementFilters,
  ): Observable<PaginatedResponse<AccountMovement>> {
    let params = new HttpParams().set('page', page).set('per_page', perPage);

    if (filters?.type) {
      params = params.set('type', filters.type);
    }

    if (filters?.status) {
      params = params.set('status', filters.status);
    }

    return this.http.get<PaginatedResponse<AccountMovement>>(this.apiUrl, { params });
  }

  registerPayment(
    accountMovementId: number,
    payment: AccountPaymentRequest,
  ): Observable<AccountMovementResourceResponse> {
    return this.http.post<AccountMovementResourceResponse>(
      `${this.apiUrl}/${accountMovementId}/payments`,
      payment,
    );
  }
}
