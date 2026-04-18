import api from './api';
import { ApiResponse } from '../types';

export interface Ad {
    _id: string;
    title: string;
    description: string;
    image: {
        public_id: string;
        url: string;
    };
    link: string;
    type: 'popup' | 'banner';
    isActive: boolean;
    displayFrequency: number;
    createdAt: string;
}

export const adService = {
    // Get all ads (Admin)
    getAds: async (): Promise<Ad[]> => {
        const response = await api.get<ApiResponse<{ ads: Ad[] }>>('/ads');
        return response.data.data.ads;
    },

    // Get active ads (Public)
    getActiveAds: async (): Promise<Ad[]> => {
        const response = await api.get<ApiResponse<{ ads: Ad[] }>>('/ads/active');
        return response.data.data.ads;
    },

    // Create ad
    createAd: async (adData: FormData): Promise<Ad> => {
        const response = await api.post<ApiResponse<{ ad: Ad }>>('/ads', adData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data.ad;
    },

    // Update ad
    updateAd: async (id: string, adData: FormData): Promise<Ad> => {
        const response = await api.put<ApiResponse<{ ad: Ad }>>(`/ads/${id}`, adData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data.ad;
    },

    // Delete ad
    deleteAd: async (id: string): Promise<void> => {
        await api.delete(`/ads/${id}`);
    },
};
