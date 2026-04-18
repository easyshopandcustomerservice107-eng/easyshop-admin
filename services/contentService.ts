import api from './api';
import { ApiResponse } from '../types';

export const contentService = {
    getContent: async (identifier: string = 'home_page') => {
        const response = await api.get<ApiResponse<{ content: any }>>(`/content/${identifier}`);
        return response.data.data.content;
    },

    updateContent: async (identifier: string, data: FormData) => {
        const response = await api.put<ApiResponse<{ content: any }>>(`/content/${identifier}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data.content;
    }
};
