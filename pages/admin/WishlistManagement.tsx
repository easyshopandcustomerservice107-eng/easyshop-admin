import React, { useState, useEffect } from 'react';
import { Heart, TrendingUp, Package } from 'lucide-react';
import { wishlistService } from '../../services/wishlistService';
import { Link } from 'react-router-dom';

interface WishlistStat {
    _id: string;
    count: number;
    product: {
        _id: string;
        name: string;
        price: number;
        images: { url: string }[];
        stock: number;
    };
}

const WishlistManagement: React.FC = () => {
    const [stats, setStats] = useState<WishlistStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await wishlistService.getWishlistStats();
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch wishlist stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin h-12 w-12 border-4 border-accent-gold border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Wishlist Analytics</h1>
                <p className="text-gray-500 font-medium">Monitor the most desired products in the system.</p>
            </div>

            {stats.length === 0 ? (
                <div className="bg-gray-50 rounded-[2.5rem] p-20 text-center">
                    <Heart className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No wishlist data available yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {stats.map((stat, index) => (
                        <div key={stat._id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 hover:shadow-xl transition-all flex items-center space-x-8 group">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl ${index === 0 ? 'bg-yellow-50 text-yellow-600' : index === 1 ? 'bg-gray-100 text-gray-600' : index === 2 ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'}`}>
                                #{index + 1}
                            </div>

                            <Link to={`/admin/products`} className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                <img
                                    src={stat.product.images?.[0]?.url}
                                    alt={stat.product.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                />
                            </Link>

                            <div className="flex-1">
                                <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight mb-1 group-hover:text-accent-gold transition-colors">{stat.product.name}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center space-x-2">
                                        <Package className="w-4 h-4" />
                                        <span className="font-bold">Stock: {stat.product.stock}</span>
                                    </span>
                                    <span className="font-black text-accent-gold">${stat.product.price.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                                    <span className="text-3xl font-black text-gray-900">{stat.count}</span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Wishlist Entries</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistManagement;
