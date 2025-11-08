import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, filter, of, switchMap, take, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectRefreshToken,
  selectToken,
} from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {

//   const authService = inject(AuthService);
//   const token = authService.token ?? '';
//   const headers = new HttpHeaders({
//     'Content-Type':'application/json',
//     Authorization: `Bearer ${token}`
//   })
//   const newReq =req.clone({headers});

//   return next(newReq).pipe(
//     catchError((error)=>{
//       console.log(error)
//       if (error.status===403 && error.error.message === 'Forbidden') {
//         const refreshToken = authService.refreshStorageToken ?? '';
//         return authService.refreshToken(refreshToken).pipe(

//           switchMap((res:any)=>{
//             const newReq = req.clone({setHeaders:{Authorization:`Bearer ${res.token}`}});
//             localStorage.setItem('token', res.token);
//             return next(newReq)
//           })
//         )
//       }
//       return throwError(()=>error)

//     })
//   );
// };

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  let currentToken = '';
  store
    .select(selectToken)
    .pipe(take(1))
    .subscribe((token) => (currentToken = token ?? ''));

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${currentToken}`,
  });

  const newReq = req.clone({ headers });

  return next(newReq).pipe(
    catchError((error) => {
      console.log(error);
      if (error.status === 403 && error.error.message === 'Forbidden') {
        let refreshToken = '';
        store
          .select(selectRefreshToken)
          .pipe(take(1))
          .subscribe((token) => {
            refreshToken = token ?? '';
          });

        store.dispatch(AuthActions.refreshToken({ refreshToken }));

        return store.select(selectToken).pipe(
          filter((token) => token !== currentToken && token !== null),
          take(1),
          switchMap((newToken) => {
            // Reintentar request con nuevo token
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(retryReq);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
