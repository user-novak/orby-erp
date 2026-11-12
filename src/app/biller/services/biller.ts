import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResponse } from '../../core/models/global';
import { forkJoin, map, Observable } from 'rxjs';
import {
  BillerData,
  BillerDataSalesResponse,
  BillerRequest,
  BillerResourceResponse,
} from '../models/biller';
import { SalesFilters } from '../../sales/models/sales';
import { API_BASE_URL } from '../../core/constants/global';
import { ClientService } from '../../clients/services/client';
import { ProductService } from '../../products/services/product';
import { AccountService } from '../../accounts/services/account';

@Injectable({
  providedIn: 'root',
})
export class BillerService {
  private readonly apiUrl = `${API_BASE_URL}/billers`;

  constructor(
    private readonly http: HttpClient,
    private readonly clientService: ClientService,
    private readonly productService: ProductService,
    private readonly accountService: AccountService,
  ) {}

  getBillerData(): Observable<BillerData> {
    return forkJoin({
      clients: this.clientService.getClients(1, 50).pipe(map((response) => response.data)),
      products: this.productService.getProducts(1, 50).pipe(map((response) => response.data)),
      accounts: this.accountService.getAccounts(1, 50).pipe(map((response) => response.data)),
    });
  }

  registerSale(billerRequest: BillerRequest): Observable<BillerResourceResponse> {
    return this.http.post<BillerResourceResponse>(this.apiUrl, billerRequest);
  }

  getSales(
    page = 1,
    perPage = 5,
    filters?: SalesFilters,
  ): Observable<PaginatedResponse<BillerDataSalesResponse>> {
    let params = new HttpParams().set('page', page).set('per_page', perPage);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<PaginatedResponse<BillerDataSalesResponse>>(this.apiUrl, { params });
  }
}
