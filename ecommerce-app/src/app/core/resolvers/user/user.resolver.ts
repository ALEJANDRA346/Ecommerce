import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { ToastService } from '../../services/toast/toast.service';
import { catchError, of, switchMap } from 'rxjs';
import { User } from '../../types/User';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../store/auth/auth.selectors';

export const userResolver: ResolveFn<User | null> = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const toastService = inject(ToastService);
  const store = inject(Store);

  return store.select(selectUserId).pipe(
    switchMap((id) =>
      userService.getUserById(id ?? '').pipe(
        catchError((error) => {
          console.log(error);
          toastService.error('No se puedieron cargar los datos del usuario');
          router.navigateByUrl('/');
          return of(null);
        })
      )
    )
  );
};
