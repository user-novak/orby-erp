import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/constants/global';
import {
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
}
