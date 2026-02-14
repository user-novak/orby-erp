import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../models/client';
import { Observable } from 'rxjs';
import { RequestResponse } from '../../core/models/global';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'https://orby-engine.fly.dev/api/clients';

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  createBulk(clients: Client[]): Observable<RequestResponse> {
    return this.http.post<RequestResponse>(`${this.apiUrl}/bulk`, { clients });
  }
}
