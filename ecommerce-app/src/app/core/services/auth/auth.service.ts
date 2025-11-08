import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, map, Observable, } from 'rxjs';
import { tokenSchema } from '../../types/Token';
import { Router } from '@angular/router';

export type decodedToken = {
  userId: string;
  displayName: string;
  role: 'admin' | 'customer' | 'guest';
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'http://localhost:3000/api';

  private readonly httpClient = inject(HttpClient);

  checkEmailExist(email: string): Observable<boolean> {
    return this.httpClient
      .get<{ exists: boolean }>(`${this.baseUrl}/auth/check-email`, {
        params: { email },
      })
      .pipe(map((res) => res.exists));
  }
}

