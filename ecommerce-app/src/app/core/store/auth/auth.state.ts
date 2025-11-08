import { decodedToken } from "../../types/Token";

export interface AuthState{
    token: string | null;
    refreshToken:string | null;
    decodedToken: decodedToken | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export const initialAuthState: AuthState = {
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    decodedToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
}