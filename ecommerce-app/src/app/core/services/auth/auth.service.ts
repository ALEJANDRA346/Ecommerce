import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { tokenSchema } from '../../types/Token';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { environment } from '../../../../environments/environment';
import { DecodedToken } from '../../types/DecodedToken';
import { Store } from '@ngrx/store'; // <-- Añade esta línea
import * as AuthActions from '../../store/auth/auth.actions'; // <-- Añade esta línea

export interface AuthUser {
  token: string;
  refreshToken?: string;
  decoded: DecodedToken;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = `${environment.BACK_URL}/api`;

  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly store = inject(Store); // <-- Añade esta línea

  private authSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  auth$: Observable<boolean> = this.authSubject.asObservable();

  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    // Inicializa estado de auth según token
    this.authSubject.next(!!this.token);
    this.loadUserFromStorage();
  }

  isAuth(): boolean {
    return this.authSubject.value;
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      this.userSubject.next({
        token,
        decoded,
        refreshToken: localStorage.getItem('refreshToken') ?? undefined,
      });
      // CartService (u otros) pueden suscribirse a user$ para reaccionar.
    }
  }

  get token(): string | null {
    return this.userSubject.value?.token ?? null;
  }

  get decodedToken(): DecodedToken | null {
    return this.userSubject.value?.decoded ?? null;
  }

  get refreshStorageToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  register(data: any) {
    return this.httpClient
      .post(`${this.baseUrl}/auth/register`, data)
      .subscribe({
        next: () => {
          this.toast.success('Cuenta creada correctamente', 3000);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          const backendErrors = err?.error?.errors;
          if (backendErrors && backendErrors.length > 0) {
            this.toast.error(backendErrors[0].msg, 4000);
          } else {
            const msg = err?.error?.message ?? 'Error al registrar';
            this.toast.error(msg, 4000);
          }
          console.error('Register error', err);
        },
      });
  }

  login(data: any) {
    return this.httpClient
      .post(`${this.baseUrl}/auth/login`, data)
      .subscribe({
        next: (raw: any) => {
          console.log('LOGIN raw response ===>', raw);

          const token = raw?.token;

          // Validación mínima: que haya un string no vacío
          if (!token || typeof token !== 'string' || token.trim().length === 0) {
            console.error('Token inválido en la respuesta', raw);
            this.toast.error('Respuesta inválida del servidor (token no válido)', 4000);
            return;
          }

          // Decodificamos el JWT
          const decoded = jwtDecode<DecodedToken>(token);

          const user: AuthUser = {
            token,
            decoded,
            // Por ahora NO usamos refreshToken, tu backend no lo manda
            refreshToken: undefined,
          };

          // Guardar en storage
          localStorage.setItem('token', user.token);
          // Si en el futuro agregas refreshToken, aquí lo guardas también

          // Actualizar estado
          this.userSubject.next(user);
          this.authSubject.next(true);

          // <-- Añade estas líneas para actualizar el store
          this.store.dispatch(AuthActions.loginSuccess({
            token: user.token,
            refreshToken: user.refreshToken || '',
            decodedToken: user.decoded
          }));

          this.toast.success(`¡Bienvenido ${decoded.displayName}!`, 3000);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Login error', err);
          const msg = err?.error?.message ?? 'Error de autenticación';
          this.toast.error(msg, 4000);
        },
      });
  }

  logout(redirect = '/'): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.userSubject.next(null);
    this.authSubject.next(false);
    this.toast.success('Sesión cerrada', 2500);
    this.router.navigate([redirect]);
  }

  refreshToken(refreshToken: string) {
    return this.httpClient.post(`${this.baseUrl}/auth/refresh-token`, {
      token: refreshToken,
    });
  }

  checkEmailExist(email: string): Observable<boolean> {
    return this.httpClient
      .get<{ exists: boolean }>(`${this.baseUrl}/auth/check-email`, {
        params: { email },
      })
      .pipe(map((res) => res.exists));
  }
}