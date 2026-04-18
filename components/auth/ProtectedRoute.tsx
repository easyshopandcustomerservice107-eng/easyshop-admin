import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin h-8 w-8 border-4 border-accent-gold border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to="/" state={{ from: location, openLogin: true }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
