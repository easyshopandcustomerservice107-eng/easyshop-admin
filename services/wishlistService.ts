import axios from 'axios';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

export const wishlistService = {
    toggleWishlist: async (productId: string) => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post(`${API_URL}/users/wishlist/${productId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    getWishlist: async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}/users/wishlist`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data.wishlist;
    },

    getWishlistStats: async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}/users/admin/wishlist-stats`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data.stats;
    }
};
