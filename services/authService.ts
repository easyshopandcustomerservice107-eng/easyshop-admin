import api from './api';
import { AuthResponse, User, ApiResponse } from '../types';

export const authService = {
    // Register new user
    register: async (data: {
        name: string;
        email: string;
        password: string;
    }): Promise<{ userId: string; email: string }> => {
        const response = await api.post<ApiResponse<{ userId: string; email: string }>>(
            '/auth/register',
            data
        );
        return response.data.data;
    },

    // Login user
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
            email,
            password,
        });
        return response.data.data;
    },

    // Logout user
    logout: async (): Promise<void> => {
        await api.post('/auth/logout');
    },

    // Forgot password
    forgotPassword: async (email: string): Promise<void> => {
        await api.post('/auth/forgot-password', { email });
    },

    // Reset password
    resetPassword: async (token: string, password: string): Promise<void> => {
        await api.post('/auth/reset-password', { token, password });
    },

    // Verify email (token from URL query param sent to backend as GET)
    verifyEmail: async (token: string): Promise<{ email: string }> => {
        const response = await api.get<ApiResponse<{ email: string }>>(`/auth/verify-email?token=${token}`);
        return response.data.data;
    },

    // Resend verification email
    resendVerification: async (email: string): Promise<void> => {
        await api.post('/auth/resend-verification', { email });
    },

    // Get current user (using stored token)
    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<ApiResponse<{ user: User }>>('/users/profile');
        return response.data.data.user;
    },
};
