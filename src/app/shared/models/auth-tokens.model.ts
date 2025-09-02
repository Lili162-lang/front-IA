export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: number | string;
    email: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    role: string;
    roles?: string[];
}

export interface LoginResponse {
    success: boolean;
    message?: string;
    data?: AuthTokens;
    user?: User;
    token?: string; // For direct token response
    accessToken?: string; // Alternative token field
    refreshToken?: string; // Alternative refresh token field
    expiresIn?: number; // Alternative expiration field
    errors?: string[];
}
