// Return Management Component
import React, { useState, useEffect } from 'react';
import {
    RotateCcw,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    XCircle,
    RefreshCcw,
    AlertCircle,
    User,
    ArrowUpRight,
    X,
    MessageSquare,
    DollarSign,
    Package,
    ChevronRight,
    ChevronDown
} from 'lucide-react';
import { returnService, ReturnRequest } from '../../services/returnService';
import toast from 'react-hot-toast';

const ReturnManagement: React.FC = () => {
    const [returns, setReturns] = useState<ReturnRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetchReturns();
    }, []);

    const fetchReturns = async () => {
        try {
            setLoading(true);
            const data = await returnService.getAllReturns();
            setReturns(data);
        } catch (err: any) {
            toast.error('Failed to fetch return requests');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedReturn || !newStatus) return;

        try {
            setUpdateLoading(true);
            await returnService.updateReturnStatus(selectedReturn._id, newStatus, adminNotes);
            toast.success('Return status updated');
            setIsStatusModalOpen(false);
            setAdminNotes('');
            fetchReturns();
        } catch (err: any) {
            toast.error('Failed to update status');
        } finally {
            setUpdateLoading(false);
        }
    };

    const filteredReturns = returns.filter(ret => {
        const matchesSearch =
            ret._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ret.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ret.order?._id?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || ret.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Processing': return { bg: 'bg-amber-50 border-amber-100', text: 'text-amber-700', icon: <Clock className="w-3 h-3" />, dot: 'bg-amber-500' };
            case 'Approved': return { bg: 'bg-blue-50 border-blue-100', text: 'text-blue-700', icon: <CheckCircle2 className="w-3 h-3" />, dot: 'bg-blue-500' };
            case 'Returned': return { bg: 'bg-accent-gold/10 border-indigo-100', text: 'text-indigo-700', icon: <RefreshCcw className="w-3 h-3" />, dot: 'bg-accent-gold/100' };
            case 'Refunded': return { bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-700', icon: <DollarSign className="w-3 h-3" />, dot: 'bg-emerald-500' };
            case 'Rejected': return { bg: 'bg-rose-50 border-rose-100', text: 'text-rose-700', icon: <XCircle className="w-3 h-3" />, dot: 'bg-rose-500' };
            default: return { bg: 'bg-slate-50 border-slate-100', text: 'text-slate-700', icon: <AlertCircle className="w-3 h-3" />, dot: 'bg-slate-500' };
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase leading-none">Returns</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="h-1 w-12 bg-accent-gold rounded-full"></div>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Manage customer returns and refunds.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-slate-100 flex gap-1">
                        {['All', 'Processing', 'Approved', 'Refunded'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${statusFilter === status
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 scale-105'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-indigo-100/20 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/30">
                            <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Return ID</th>
                            <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                            <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                            <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Items</th>
                            <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-6 text-right pr-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={6} className="px-8 py-8"><div className="h-10 bg-slate-50 rounded-2xl w-full"></div></td>
                                </tr>
                            ))
                        ) : filteredReturns.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-8 py-32 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                        <RotateCcw className="w-8 h-8 text-slate-200" />
                                    </div>
                                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">No return requests found.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredReturns.map((ret) => {
                                const status = getStatusStyles(ret.status);
                                return (
                                    <tr key={ret._id} className="hover:bg-slate-50/30 transition-all group">
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-[11px] font-bold text-slate-900 group-hover:text-accent-gold transition-colors uppercase tracking-tighter">RET-{ret._id.slice(-6).toUpperCase()}</span>
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{new Date(ret.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform">
                                                    {ret.user?.name?.slice(0, 1).toUpperCase() || 'U'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-900">{ret.user?.name || 'Anonymous'}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold lowercase tracking-tight">{ret.user?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-mono font-bold text-accent-gold bg-accent-gold/10/50 px-2 py-0.5 rounded-lg w-fit">ORD-{ret.order?._id?.slice(-6).toUpperCase()}</span>
                                                <span className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-widest">${ret.order?.totalPrice?.toFixed(2)} Total</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="flex -space-x-3 overflow-hidden">
                                                    {(ret.items || []).slice(0, 3).map((item, idx) => (
                                                        <div key={idx} className="inline-block h-10 w-10 rounded-2xl ring-4 ring-white overflow-hidden bg-white border border-slate-100 shadow-md transform hover:translate-y-[-2px] transition-transform" title={item.product?.name}>
                                                            <img
                                                                src={item.product?.images?.[0]?.url || item.product?.image || '/placeholder.png'}
                                                                alt={item.product?.name}
                                                                className="h-full w-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Product';
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                    {(ret.items?.length || 0) > 3 && (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-[10px] font-bold text-white ring-4 ring-white shadow-md">
                                                            +{(ret.items?.length || 0) - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tighter">{ret.items?.length || 0} Products</span>
                                                    <span className="text-xs font-bold text-emerald-600 tracking-tighter mt-0.5">${ret.totalRefundAmount?.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border-2 transition-all duration-500 ${status.bg} ${status.text} group-hover:scale-105 shadow-sm`}>
                                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${status.dot}`}></div>
                                                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{ret.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right pr-8">
                                            <button
                                                onClick={() => {
                                                    setSelectedReturn(ret);
                                                    setNewStatus(ret.status);
                                                    setAdminNotes(ret.adminNotes || '');
                                                    setIsStatusModalOpen(true);
                                                }}
                                                className="inline-flex items-center gap-3 bg-slate-50 hover:bg-slate-900 text-slate-400 hover:text-white px-6 py-3 rounded-2xl transition-all duration-500 group/btn border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100"
                                            >
                                                <span className="text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 transition-all translate-x-4 group-hover/btn:translate-x-0">Edit Status</span>
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Status Modal */}
            {/* Redesigned Edit Status Modal */}
            {isStatusModalOpen && selectedReturn && (
                <div className="fixed inset-0 bg-slate-600/50 z-[200] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in duration-300">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Return Details</h2>
                                <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest mt-1">ID: RET-{selectedReturn._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <button onClick={() => setIsStatusModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg transition-all">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Simple Info Grid */}
                            <div className="grid grid-cols-2 gap-6 text-sm">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Customer</label>
                                    <p className="font-bold text-slate-900">{selectedReturn.user?.name}</p>
                                    <p className="text-xs text-slate-500">{selectedReturn.user?.email}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Order Info</label>
                                    <p className="font-mono font-bold text-accent-gold">ORD-{selectedReturn.order?._id?.slice(-8).toUpperCase()}</p>
                                    <p className="text-xs text-slate-500">${selectedReturn.order?.totalPrice?.toFixed(2)} Total</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Expected Refund</label>
                                    <p className="text-lg font-bold text-emerald-600">${selectedReturn.totalRefundAmount?.toFixed(2)}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Current Status</label>
                                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest mt-1 border ${getStatusStyles(selectedReturn.status).bg} ${getStatusStyles(selectedReturn.status).text}`}>
                                        {selectedReturn.status}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-slate-50 pt-6">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Reason for Return</label>
                                <p className="text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    {selectedReturn.reason}
                                </p>
                            </div>

                            {/* Items Section */}
                            <div className="border-t border-slate-50 pt-6">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Returned Items ({selectedReturn.items?.length || 0})</label>
                                <div className="space-y-2">
                                    {selectedReturn.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0">
                                                <img
                                                    src={item.product?.images?.[0]?.url || item.product?.image || '/placeholder.png'}
                                                    alt={item.product?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-bold text-slate-900 truncate uppercase">{item.product?.name}</p>
                                                <p className="text-[9px] text-slate-400 font-bold">Qty: {item.quantity} • ${item.price?.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-slate-50 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Update Status</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['Processing', 'Approved', 'Returned', 'Refunded', 'Rejected'].map((status) => {
                                            const isActive = newStatus === status;
                                            return (
                                                <button
                                                    key={status}
                                                    onClick={() => setNewStatus(status)}
                                                    className={`px-3 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border ${isActive
                                                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                                                        }`}
                                                >
                                                    {status}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Admin Notes</label>
                                    <textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Add notes..."
                                        rows={2}
                                        className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-accent-gold/100/10 focus:border-accent-gold/100 transition-all resize-none outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-4">
                            <button
                                onClick={() => setIsStatusModalOpen(false)}
                                className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                disabled={updateLoading}
                                className="bg-accent-gold text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center space-x-2 hover:bg-slate-900 transition-all disabled:opacity-50"
                            >
                                {updateLoading ? <RefreshCcw className="w-3 h-3 animate-spin" /> : null}
                                <span>{updateLoading ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnManagement;
