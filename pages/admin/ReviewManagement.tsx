import React, { useState, useEffect } from 'react';
import {
    Search,
    Star,
    Trash2,
    Loader2,
    User as UserIcon,
    MessageSquare
} from 'lucide-react';
import { reviewService, Review } from '../../services/reviewService';

const ReviewManagement: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await reviewService.getAllReviews();
            setReviews(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load review library');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to scrub this feedback?')) {
            try {
                await reviewService.deleteReview(id);
                setReviews(prev => prev.filter(r => r._id !== id));
            } catch (err: any) {
                alert('Action failed: ' + err.message);
            }
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-accent-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Feedback Archive</h1>
                    <p className="text-slate-400 text-sm font-medium">Moderate and monitor the collective voice of your patrons.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter reviews by keyword or user..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patron</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Commentary</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {reviews
                                .filter(r =>
                                    (r.comment || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    (r.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    (r.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    (r.product?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((r) => (
                                    <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-200">
                                                    {r.user.avatar ? (
                                                        <img src={r.user.avatar} alt={r.user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <UserIcon className="w-4 h-4 text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 text-sm">{r.user.name}</span>
                                                    <span className="text-[10px] text-slate-400">{r.user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                    {r.product?.images?.[0]?.url || r.product?.image ? (
                                                        <img src={r.product?.images?.[0]?.url || r.product?.image} alt={r.product?.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-[8px] font-black text-slate-400 p-1 text-center leading-none uppercase">Null Obj</div>
                                                    )}
                                                </div>
                                                <span className="font-bold text-slate-700 text-xs line-clamp-1 max-w-[150px]">
                                                    {r.product?.name || <span className="text-slate-300 italic">Deleted Product</span>}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center space-x-1 py-1 px-2 bg-yellow-50 text-yellow-600 rounded-lg w-fit">
                                                <Star className="w-3 h-3 fill-current" />
                                                <span className="text-xs font-black">{r.rating}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="max-w-md">
                                                <p className="text-xs text-slate-600 line-clamp-2 italic leading-relaxed">"{r.comment}"</p>
                                                <span className="text-[9px] text-slate-400 font-bold block mt-1">{new Date(r.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center justify-end">
                                                <button
                                                    onClick={() => handleDelete(r._id)}
                                                    className="p-2 text-slate-400 hover:text-rose-500 transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {reviews.length === 0 && (
                        <div className="p-20 text-center">
                            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Registry is currently empty</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewManagement;
