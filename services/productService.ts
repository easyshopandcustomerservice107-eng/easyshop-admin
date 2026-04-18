import api from './api';
import { Product, ApiResponse } from '../types';

export const productService = {
    // Get all products with optional filters
    getProducts: async (params?: {
        page?: number;
        limit?: number;
        category?: string;
        search?: string;
        sort?: string;
        minPrice?: number;
        maxPrice?: number;
        [key: string]: any; // Allow for generic filters like discount[gt]
    }): Promise<{
        products: Product[];
        pagination: { page: number; limit: number; total: number; pages: number };
    }> => {
        const response = await api.get<
            ApiResponse<{
                products: Product[];
                pagination: { page: number; limit: number; total: number; pages: number };
            }>
        >('/products', { params });
        return response.data.data;
    },

    // Get single product by ID
    getProduct: async (id: string): Promise<Product> => {
        const response = await api.get<ApiResponse<{ product: Product }>>(`/products/${id}`);
        return response.data.data.product;
    },

    // Search products
    searchProducts: async (query: string): Promise<Product[]> => {
        const response = await api.get<
            ApiResponse<{
                products: Product[];
                pagination: { page: number; limit: number; total: number; pages: number };
            }>
        >('/products', {
            params: { search: query },
        });
        return response.data.data.products;
    },

    // Admin: Create product
    createProduct: async (productData: FormData): Promise<Product> => {
        const response = await api.post<ApiResponse<{ product: Product }>>('/products', productData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data.product;
    },

    // Admin: Update product
    updateProduct: async (id: string, productData: FormData): Promise<Product> => {
        const response = await api.put<ApiResponse<{ product: Product }>>(`/products/${id}`, productData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data.product;
    },

    // Admin: Delete product
    deleteProduct: async (id: string): Promise<void> => {
        await api.delete(`/products/${id}`);
    },

    // Category methods
    getCategories: async (): Promise<any[]> => {
        const response = await api.get<ApiResponse<{ categories: any[] }>>('/products/categories');
        return response.data.data.categories;
    },

    createCategory: async (categoryData: FormData | any): Promise<any> => {
        const isFormData = categoryData instanceof FormData;
        const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        const response = await api.post<ApiResponse<{ category: any }>>('/products/categories', categoryData, config);
        return response.data.data.category;
    },

    updateCategory: async (id: string, categoryData: FormData | any): Promise<any> => {
        const isFormData = categoryData instanceof FormData;
        const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        const response = await api.put<ApiResponse<{ category: any }>>(`/products/categories/${id}`, categoryData, config);
        return response.data.data.category;
    },

    deleteCategory: async (id: string): Promise<void> => {
        await api.delete(`/products/categories/${id}`);
    },
};
