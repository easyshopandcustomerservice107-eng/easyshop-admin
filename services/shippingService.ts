import api from './api';
import { ApiResponse } from '../types';

export interface ShippingSettings {
    _id?: string;
    shippingFee: number;
    freeShippingThreshold: number;
    isActive: boolean;
}

export const shippingService = {
    getSettings: async (): Promise<ShippingSettings> => {
        const response = await api.get<ApiResponse<{ settings: ShippingSettings }>>('/shipping');
        return response.data.data.settings;
    },

    updateSettings: async (settings: Partial<ShippingSettings>): Promise<ShippingSettings> => {
        const response = await api.post<ApiResponse<{ settings: ShippingSettings }>>('/shipping/settings', settings);
        return response.data.data.settings;
    }
};
