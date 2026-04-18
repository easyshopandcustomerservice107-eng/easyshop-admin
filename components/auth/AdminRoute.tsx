import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute: React.FC = () => {
    const { user, isLoggedIn, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-accent-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isLoggedIn || user?.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
