import api from './api';
import { ApiResponse } from '../types';

export interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    product: {
        _id: string;
        name: string;
        images?: { url: string }[];
        image?: string;
    };
    rating: number;
    comment: string;
    images?: { url: string }[];
    createdAt: string;
}

export const reviewService = {
    getAllReviews: async (): Promise<Review[]> => {
        const response = await api.get<ApiResponse<{ reviews: Review[] }>>('/reviews');
        return response.data.data.reviews;
    },

    getProductReviews: async (productId: string): Promise<Review[]> => {
        const response = await api.get<ApiResponse<{ reviews: Review[] }>>(`/reviews/product/${productId}`);
        return response.data.data.reviews;
    },

    deleteReview: async (id: string): Promise<void> => {
        await api.delete(`/reviews/${id}`);
    },

    createReview: async (formData: FormData): Promise<Review> => {
        const response = await api.post<ApiResponse<{ review: Review }>>('/reviews', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data.review;
    },
};
