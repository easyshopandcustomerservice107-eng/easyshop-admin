import api from './api';
import { ApiResponse } from '../types';

export interface AdminStats {
    stats: {
        totalUsers: number;
        totalOrders: number;
        totalProducts: number;
        totalCategories: number;
        totalRevenue: number;
    };
    recentOrders: any[];
    salesData: { _id: number; revenue: number; count: number }[];
}

export const adminService = {
    getDashboardStats: async (): Promise<AdminStats> => {
        const response = await api.get<ApiResponse<AdminStats>>('/admin/stats');
        return response.data.data;
    },
};
