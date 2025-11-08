import { createReducer, on } from "@ngrx/store";
import { initialAuthState} from "./auth.state";
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
    initialAuthState,
    
    // Initialize Auth
    on(AuthActions.initializeAuth, (state) => ({
        ...state,
        isLoading: true
    })),

    on(AuthActions.initializeAuthSuccess, (state, { decodedToken }) => ({
        ...state,
        decodedToken,
        isAuthenticated: true,  
        isLoading: false,
    })),

    on(AuthActions.initializeAuthFailure, (state) => ({
        ...state,
        token: null,
        refreshToken: null,
        decodedToken: null,
        isAuthenticated: false,  
        isLoading: false,
    })),

    // Login
    on(AuthActions.login, (state) => ({
        ...state, 
        isLoading: true,
        error: null,
    })),

    on(AuthActions.loginSuccess, (state, { token, refreshToken, decodedToken }) => ({
        ...state,
        token,
        refreshToken,
        decodedToken,
        isAuthenticated: true,  
        isLoading: false,
        error: null,
    })),

    on(AuthActions.loginFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
        isAuthenticated: false  
    })),

    // Register
    on(AuthActions.register, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),

    on(AuthActions.registerSuccess, (state) => ({
        ...state,
        isLoading: false,
        error: null
    })),

    on(AuthActions.registerFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
    })),

    // Refresh Token
    on(AuthActions.refreshTokenSuccess, (state, { token, refreshToken, decodedToken }) => ({
        ...state,
        token,
        refreshToken,
        decodedToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
    })),

    on(AuthActions.refreshTokenFailure, (state, { error }) => ({
        ...state,
        token: null,
        refreshToken: null,
        decodedToken: null,
        isAuthenticated: false,
        isLoading: false,
        error,
    })),

    // Logout
    on(AuthActions.Logout, () => ({
        ...initialAuthState,
        token: null,
        refreshToken: null,
        decodedToken: null,
        isAuthenticated: false,
    }))
);

