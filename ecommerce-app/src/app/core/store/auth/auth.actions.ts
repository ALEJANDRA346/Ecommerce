import { createAction, props } from '@ngrx/store';
import { UserCredentials, UserForm } from '../../types/User';
import { decodedToken } from '../../types/Token';

export const login = createAction(
  '[Auth] login',
  props<{ credentials: UserCredentials }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: string; refreshToken: string; decodedToken: decodedToken }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const Logout = createAction('[Auth] Logout');

export const register = createAction(
  '[Auth] Register',
  props<{ userData: UserForm }>()
);

export const registerSuccess = createAction('[Auth] Register Success');
export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

export const refreshToken = createAction(
  '[Auth] Refresh Token',
  props<{ refreshToken: string }>()
);

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ token: string; refreshToken: string; decodedToken: decodedToken }>()
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>()
);

export const initializeAuth = createAction('[Auth] Initialize');

export const initializeAuthSuccess = createAction(
  '[Auth] Initialize Success',
  props<{ decodedToken: decodedToken }>()
);

export const initializeAuthFailure = createAction('[Auth] Initialize Failure');

export const checkEmailExists = createAction(
  '[Auth] Check Email Exists',
  props<{ email: string }>()
);

export const checkEmailExistsSuccess = createAction(
  '[Auth] Check Email Exists Success',
  props<{ exists: boolean }>()
);

export const checkEmailExistsFailure = createAction(
  '[Auth] Check Email Exists Failure',
  props<{ error: string }>()
);
