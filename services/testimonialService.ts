import api from './api';
import { ApiResponse } from '../types';

export interface Testimonial {
    _id: string;
    name: string;
    role: string;
    company?: string;
    content: string;
    rating: number;
    avatar?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const testimonialService = {
    // Get all active testimonials
    getTestimonials: async (): Promise<Testimonial[]> => {
        const response = await api.get<ApiResponse<{ testimonials: Testimonial[]; count: number }>>('/testimonials');
        return response.data.data.testimonials;
    },

    // Get single testimonial
    getTestimonial: async (id: string): Promise<Testimonial> => {
        const response = await api.get<ApiResponse<{ testimonial: Testimonial }>>(`/testimonials/${id}`);
        return response.data.data.testimonial;
    },

    // Admin: Create testimonial
    createTestimonial: async (testimonialData: Partial<Testimonial>): Promise<Testimonial> => {
        const response = await api.post<ApiResponse<{ testimonial: Testimonial }>>('/testimonials', testimonialData);
        return response.data.data.testimonial;
    },

    // Admin: Update testimonial
    updateTestimonial: async (id: string, testimonialData: Partial<Testimonial>): Promise<Testimonial> => {
        const response = await api.put<ApiResponse<{ testimonial: Testimonial }>>(`/testimonials/${id}`, testimonialData);
        return response.data.data.testimonial;
    },

    // Admin: Delete testimonial
    deleteTestimonial: async (id: string): Promise<void> => {
        await api.delete(`/testimonials/${id}`);
    },
};
