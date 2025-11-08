import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

// Feature selector
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Basic selectors
export const selectToken = createSelector(
  selectAuthState,
  (state) => state.token
);

export const selectRefreshToken = createSelector(
  selectAuthState,
  (state) => state.refreshToken
);

export const selectDecodedToken = createSelector(
  selectAuthState,
  (state) => state.decodedToken
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state) => state.isLoading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

// Derived selectors
export const selectUserId = createSelector(
  selectDecodedToken,
  (decodedToken) => decodedToken?.userId ?? null
);

export const selectUserDisplayName = createSelector(
  selectDecodedToken,
  (decodedToken) => decodedToken?.displayName ?? null
);

export const selectUserRole = createSelector(
  selectDecodedToken,
  (decodedToken) => decodedToken?.role ?? null
);

export const selectIsAdmin = createSelector(
  selectUserRole,
  (role) => role === 'admin'
);

export const selectIsCustomer = createSelector(
  selectUserRole,
  (role) => role === 'customer'
);

export const selectAuthInfo = createSelector(
  selectIsAuthenticated,
  selectDecodedToken,
  selectIsLoading,
  (isAuthenticated, decodedToken, isLoading) => ({
    isAuthenticated,
    user: decodedToken,
    isLoading,
  })
);