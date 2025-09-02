export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: AuthTokens;
    user?: {
        id: number;
        email: string;
        name: string;
        role: string;
    };
}
