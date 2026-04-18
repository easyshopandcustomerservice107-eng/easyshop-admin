import api from './api';
import { User, Address, ApiResponse } from '../types';

export const userService = {
    // Get user profile
    getProfile: async (): Promise<User> => {
        const response = await api.get<ApiResponse<{ user: User }>>('/users/profile');
        return response.data.data.user;
    },

    // Update user profile
    updateProfile: async (data: FormData): Promise<User> => {
        const response = await api.put<ApiResponse<{ user: User }>>('/users/profile', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data.user;
    },

    // Get user addresses
    getAddresses: async (): Promise<Address[]> => {
        const response = await api.get<ApiResponse<{ addresses: Address[] }>>('/users/addresses');
        return response.data.data.addresses;
    },

    // Add address
    addAddress: async (address: Omit<Address, '_id'>): Promise<Address> => {
        const response = await api.post<ApiResponse<{ address: Address }>>('/users/address', address);
        return response.data.data.address;
    },

    // Update address
    updateAddress: async (id: string, address: Partial<Address>): Promise<Address> => {
        const response = await api.put<ApiResponse<{ address: Address }>>(`/users/address/${id}`, address);
        return response.data.data.address;
    },

    // Delete address
    deleteAddress: async (id: string): Promise<void> => {
        await api.delete(`/users/address/${id}`);
    },

    // Admin: Get all users
    getAllUsers: async (): Promise<User[]> => {
        const response = await api.get<ApiResponse<{ users: User[] }>>('/users');
        return response.data.data.users;
    },

    // Change password
    changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
        await api.put('/users/change-password', { currentPassword, newPassword });
    },
};
