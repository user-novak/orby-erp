import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../core/models/global';
import { Observable } from 'rxjs';
import { BillerData } from '../models/biller';

@Injectable({
  providedIn: 'root',
})
export class BillerService {
  private apiUrl = 'https://orby-engine.fly.dev/api/biller/data';

  constructor(private http: HttpClient) {}

  getBillerData(): Observable<ApiResponse<BillerData>> {
    return this.http.get<ApiResponse<BillerData>>(this.apiUrl);
  }
}
