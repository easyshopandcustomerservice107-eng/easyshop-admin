import axios from 'axios';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

export const analyticsService = {
    getAnalytics: async (period: string = 'daily', days: number = 30) => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}/admin/analytics`, {
            params: { period, days },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    }
};
