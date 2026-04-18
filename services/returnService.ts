import api from './api';
import { ApiResponse } from '../types';

export interface ReturnItem {
    product: any;
    quantity: number;
    price: number;
}

export interface ReturnRequest {
    _id: string;
    order: any;
    user: any;
    reason: string;
    items: ReturnItem[];
    totalRefundAmount: number;
    status: 'Processing' | 'Approved' | 'Returned' | 'Refunded' | 'Rejected';
    adminNotes?: string;
    createdAt: string;
}

export const returnService = {
    // Create return request
    createReturnRequest: async (orderId: string, reason: string, items?: { product: string, quantity: number }[]): Promise<ReturnRequest> => {
        const response = await api.post<ApiResponse<{ returnRequest: ReturnRequest }>>('/returns', { orderId, reason, items });
        return response.data.data.returnRequest;
    },

    // Get my returns
    getMyReturns: async (): Promise<ReturnRequest[]> => {
        const response = await api.get<ApiResponse<{ returns: ReturnRequest[] }>>('/returns/my-returns');
        return response.data.data.returns;
    },

    // Admin: Get all returns
    getAllReturns: async (): Promise<ReturnRequest[]> => {
        const response = await api.get<ApiResponse<{ returns: ReturnRequest[] }>>('/returns');
        return response.data.data.returns;
    },

    // Admin: Update return status
    updateReturnStatus: async (id: string, status: string, adminNotes?: string): Promise<ReturnRequest> => {
        const response = await api.put<ApiResponse<{ returnRequest: ReturnRequest }>>(`/returns/${id}/status`, { status, adminNotes });
        return response.data.data.returnRequest;
    }
};
