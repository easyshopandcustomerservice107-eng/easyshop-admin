import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-[#F8F9FA]">
            <AdminSidebar />
            <main className="flex-1 flex flex-col">
                <header className="h-16 glass-morphism grain-texture border-b border-accent/20 sticky top-0 z-10 px-8 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">
                            Vault Management System
                        </h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 rounded-full border border-accent/30 flex items-center justify-center">
                             <div className="h-2 w-2 rounded-full bg-accent animate-pulse"></div>
                        </div>
                    </div>
                </header>

                <div className="p-8 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
