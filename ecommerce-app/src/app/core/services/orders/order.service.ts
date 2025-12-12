import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = `${environment.BACK_URL}/api/orders`;

  constructor(private http: HttpClient) { }

  // 👇 MEJORADO: endpoint /orders (POST), validación userId
  createOrder(payload: any): Observable<any> {
    if (!payload.user || payload.user === '') {
      return throwError(() => new Error('Usuario no autenticado'));
    }
    return this.http.post(this.baseUrl, payload);
  }

  // Para historial (después)
  getMyOrders(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }
}