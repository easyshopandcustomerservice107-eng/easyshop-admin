import api from './api';
import { Order, ApiResponse } from '../types';

export const orderService = {
    // Create order
    createOrder: async (orderData: {
        items: { product: string; quantity: number; price: number }[];
        shippingAddress: string;
        paymentMethod: 'Stripe' | 'COD';
        itemsPrice: number;
        taxPrice: number;
        shippingPrice: number;
        totalPrice: number;
    }): Promise<Order> => {
        const response = await api.post<ApiResponse<{ order: Order }>>('/orders', orderData);
        return response.data.data.order;
    },

    // Get user orders
    getMyOrders: async (): Promise<Order[]> => {
        const response = await api.get<ApiResponse<{ orders: Order[] }>>('/orders/my-orders');
        return response.data.data.orders;
    },

    // Get order by ID
    getOrderById: async (id: string): Promise<Order> => {
        const response = await api.get<ApiResponse<{ order: Order }>>(`/orders/${id}`);
        return response.data.data.order;
    },

    // Update order to paid
    updateOrderToPaid: async (
        id: string,
        paymentResult: {
            id: string;
            status: string;
            update_time: string;
            email_address: string;
        }
    ): Promise<Order> => {
        const response = await api.put<ApiResponse<{ order: Order }>>(`/orders/${id}/pay`, paymentResult);
        return response.data.data.order;
    },

    // Cancel order
    cancelOrder: async (id: string): Promise<Order> => {
        await api.put(`/orders/${id}/cancel`);
        const response = await api.get<ApiResponse<{ order: Order }>>(`/orders/${id}`);
        return response.data.data.order;
    },

    // Admin: Get all orders
    getAllOrders: async (): Promise<Order[]> => {
        const response = await api.get<ApiResponse<{ orders: Order[] }>>('/orders');
        return response.data.data.orders;
    },

    // Admin: Update to delivered
    deliverOrder: async (id: string): Promise<Order> => {
        const response = await api.put<ApiResponse<{ order: Order }>>(`/orders/${id}/deliver`);
        return response.data.data.order;
    },

    updateOrderStatus: async (id: string, status: string, trackingNumber?: string): Promise<Order> => {
        const response = await api.put<ApiResponse<{ order: Order }>>(`/orders/${id}/status`, {
            status,
            trackingNumber,
        });
        return response.data.data.order;
    },

    // Public: Track order
    trackOrder: async (orderId: string): Promise<Order> => {
        const response = await api.post<ApiResponse<{ order: Order }>>('/orders/track', { orderId });
        return response.data.data.order;
    },
};
