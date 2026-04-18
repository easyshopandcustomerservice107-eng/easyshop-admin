import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Tag,
    LogOut,
    ChevronLeft,
    MessageSquare,
    Megaphone,
    Heart,
    MessageCircle,
    RotateCcw,
    CreditCard,
    Settings,
    Truck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar: React.FC = () => {
    const { logout } = useAuth();

    const navItems = [
        { title: 'Dashboard', path: '/', icon: LayoutDashboard },
        { title: 'Products', path: '/products', icon: Package },
        { title: 'Orders', path: '/orders', icon: ShoppingBag },
        { title: 'Return Requests', path: '/returns', icon: RotateCcw },
        { title: 'Users', path: '/users', icon: Users },
        { title: 'Categories', path: '/categories', icon: Tag },
        { title: 'Reviews', path: '/reviews', icon: MessageSquare },
        { title: 'Testimonials', path: '/testimonials', icon: MessageCircle },
        { title: 'Shipping Settings', path: '/shipping', icon: Truck },
        { title: 'Payment Methods', path: '/settings?tab=payments', icon: CreditCard },
        { title: 'Settings', path: '/settings', icon: Settings },
        { title: 'Wishlist', path: '/wishlist', icon: Heart },
        { title: 'Ad Management', path: '/ads', icon: Megaphone },
        // { title: 'Stock Inventory', path: '/inventory', icon: Package },

    ];

    return (
        <aside className="w-64 bg-primary text-white/60 h-screen sticky top-0 flex flex-col overflow-y-auto border-r border-accent/10 grain-texture">
            <div className="p-8">
                <h1 className="text-xl font-sans font-black text-white tracking-tighter uppercase leading-tight">
                    Easy Shop <br />
                    <span className="gold-gradient shimmer-gold">Admin</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-3">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                            `flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-500 group ${isActive
                                ? 'bg-accent/10 text-accent shadow-[0_0_20px_rgba(197,160,89,0.15)] border border-accent/20'
                                : 'hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110`} />
                        <span className="font-black text-[10px] uppercase tracking-[0.2em]">{item.title}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-white/5">
                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-white/40 hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-500 group"
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
