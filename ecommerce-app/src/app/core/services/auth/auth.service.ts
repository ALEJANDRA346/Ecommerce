import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, map, Observable, } from 'rxjs';
import { tokenSchema } from '../../types/Token';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

export type decodedToken = {
  userId: string;
  displayName: string;
  role: 'admin' | 'customer' | 'guest';
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = `${environment.BACK_URL}`;

  private readonly httpClient = inject(HttpClient);

  checkEmailExist(email: string): Observable<boolean> {
    return this.httpClient
      .get<{ exists: boolean }>(`${this.baseUrl}/auth/check-email`, {
        params: { email },
      })
      .pipe(map((res) => res.exists));
  }
}

