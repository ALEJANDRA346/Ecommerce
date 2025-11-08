import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastService } from '../../services/toast/toast.service';
import { jwtDecode } from 'jwt-decode';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { decodedToken } from '../../types/Token';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly baseUrl = 'http://localhost:3000/api/auth';

  initializeAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initializeAuth),
      map(() => {
        const token = localStorage.getItem('token');

        if (!token) {
          return AuthActions.initializeAuthFailure();
        }

        const decoded = jwtDecode<decodedToken>(token);
        console.log(decoded);
        return AuthActions.initializeAuthSuccess({ decodedToken: decoded });
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      tap(credentials=>console.log(credentials)),
      switchMap(({ credentials }) =>
        this.http
          .post<{ token: string; refreshToken: string }>(
            `${this.baseUrl}/login`,
            credentials
          )
          .pipe(
            map((response) => {
              localStorage.setItem('token', response.token);
              localStorage.setItem('refreshToken', response.refreshToken);
              const decoded = jwtDecode<decodedToken>(response.token);
              return AuthActions.loginSuccess({
                token: response.token,
                refreshToken: response.refreshToken,
                decodedToken: decoded,
              });
            }),
            catchError((error) => {
              console.error('Error en login:', error);
              return of(
                AuthActions.loginFailure({
                  error: error.error?.message || 'Error al iniciar sesión',
                })
              );
            })
          )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.toast.success('Inicio de sesión exitoso');
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );
  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(({ error }) => {
          this.toast.error(error);
        })
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ userData }) =>
        this.http.post(`${this.baseUrl}/register`, userData).pipe(
          map(() => AuthActions.registerSuccess()),
          catchError((error) => {
            console.error('Error en registro:', error);
            return of(
              AuthActions.registerFailure({
                error: error.error?.message || 'Error al registrarse',
              })
            );
          })
        )
      )
    )
  );

  // Register Success - Show Toast and Redirect
  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => {
          this.toast.success('Registro exitoso. Por favor inicia sesión.');
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  // Register Failure - Show Toast
  registerFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerFailure),
        tap(({ error }) => {
          this.toast.error(error);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.Logout),
        tap(() => {
          // Limpiar localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');

          // Mostrar toast
          this.toast.success('Sesión cerrada correctamente');

          // Redirigir al home
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap(({ refreshToken }) =>
        this.http.post<{ token: string; refreshToken: string }>(
          `${this.baseUrl}/refresh-token`,
          { token: refreshToken }
        ).pipe(
          map((response)=> {
            // Actualizar tokens en localStorage
              localStorage.setItem('token', response.token);
              localStorage.setItem('refreshToken', response.refreshToken);

              // Decodificar nuevo token
              const decoded = jwtDecode<decodedToken>(response.token);
              return AuthActions.refreshTokenSuccess({
                token: response.token,
                refreshToken: response.refreshToken,
                decodedToken: decoded,
              });
          }),
          catchError((error) => {
              console.error('Error al refrescar token:', error);

              // Si falla, hacer logout
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');

              return of(
                AuthActions.refreshTokenFailure({
                  error: 'Sesión expirada',
                })
              );
            })
        )
      )
    )
  );
  refreshTokenFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.refreshTokenFailure),
        tap(() => {
          this.toast.error(
            'Sesión expirada. Por favor inicia sesión nuevamente.'
          );
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );
}
