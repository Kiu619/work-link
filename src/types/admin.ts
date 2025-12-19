import type { ApiResponse } from './api-response'

export interface Admin {
    phoneNumber: string
    password: string
}

export interface TokenResponse {
    accessToken: string
    refreshToken: string
    expiresIn: number
    tokenType: string
    scope: string | null
}


export interface LoginResponse extends ApiResponse<TokenResponse> {
    data: TokenResponse
}

export interface LogoutResponse extends ApiResponse<void> {
    data: void
}