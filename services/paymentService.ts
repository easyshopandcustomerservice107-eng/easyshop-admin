import api from './api';
import { ApiResponse, GatewaySetting } from '../types';

export const paymentService = {
    // Create payment intent
    createPaymentIntent: async (amount: number, orderId: string): Promise<{
        clientSecret: string;
        paymentIntentId: string;
    }> => {
        const response = await api.post<
            ApiResponse<{
                clientSecret: string;
                paymentIntentId: string;
            }>
        >('/payment/create-intent', {
            amount,
            orderId,
        });
        return response.data.data;
    },

    // Confirm payment
    confirmPayment: async (paymentIntentId: string): Promise<{ status: string }> => {
        const response = await api.post<ApiResponse<{ status: string }>>('/payment/confirm', {
            paymentIntentId,
        });
        return response.data.data;
    },

    // Create PayPal order
    createPaypalOrder: async (amount: number, orderId: string): Promise<{
        orderId: string;
    }> => {
        const response = await api.post<
            ApiResponse<{
                orderId: string;
            }>
        >('/payment/create-paypal-order', {
            amount,
            orderId,
        });
        return response.data.data;
    },

    // Capture PayPal order
    capturePaypalOrder: async (orderId: string): Promise<any> => {
        const response = await api.post<ApiResponse<any>>('/payment/capture-paypal-order', {
            orderId,
        });
        return response.data.data;
    },

    // Get gateway settings
    getSettings: async (): Promise<GatewaySetting[]> => {
        const response = await api.get<ApiResponse<GatewaySetting[]>>('/payment/settings');
        return response.data.data;
    },

    // Get active gateway settings (Safe/Public)
    getActiveSettings: async (): Promise<GatewaySetting[]> => {
        const response = await api.get<ApiResponse<GatewaySetting[]>>('/payment/active');
        return response.data.data;
    },

    // Update gateway setting
    updateSetting: async (setting: Partial<GatewaySetting>): Promise<GatewaySetting> => {
        const response = await api.post<ApiResponse<GatewaySetting>>('/payment/settings', setting);
        return response.data.data;
    }
};
