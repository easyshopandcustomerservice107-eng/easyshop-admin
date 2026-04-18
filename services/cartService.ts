import api from './api';
import { CartItem, ApiResponse } from '../types';

interface Cart {
    _id: string;
    user: string;
    items: CartItem[];
    totalPrice: number;
}

export const cartService = {
    // Get user cart
    getCart: async (): Promise<Cart> => {
        const response = await api.get<ApiResponse<{ cart: Cart }>>('/cart');
        return response.data.data.cart;
    },

    // Add item to cart
    addToCart: async (productId: string, quantity: number = 1): Promise<Cart> => {
        const response = await api.post<ApiResponse<{ cart: Cart }>>('/cart/add', {
            productId,
            quantity,
        });
        return response.data.data.cart;
    },

    // Update cart item quantity
    updateCartItem: async (itemId: string, quantity: number): Promise<Cart> => {
        const response = await api.put<ApiResponse<{ cart: Cart }>>(`/cart/${itemId}`, {
            quantity,
        });
        return response.data.data.cart;
    },

    // Remove item from cart
    removeFromCart: async (itemId: string): Promise<Cart> => {
        const response = await api.delete<ApiResponse<{ cart: Cart }>>(`/cart/${itemId}`);
        return response.data.data.cart;
    },

    // Clear user cart
    clearCart: async (): Promise<Cart> => {
        const response = await api.delete<ApiResponse<{ cart: Cart }>>('/cart/clear');
        return response.data.data.cart;
    },
};
