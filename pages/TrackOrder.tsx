
import React, { useState } from 'react';
import { Search, Package, Calendar, CreditCard, ChevronRight, AlertCircle, Truck } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { Link } from 'react-router-dom';

const TrackOrder: React.FC = () => {
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [order, setOrder] = useState<Order | null>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        try {
            setLoading(true);
            setError(null);
            setOrder(null);
            const data = await orderService.trackOrder(orderId.trim());
            setOrder(data);
        } catch (err: any) {
            setError(err.message || 'Order search failed. Verify Order ID.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pb-20 px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-20 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.8em] text-accent-gold mb-6 block">Order Tracking</span>
                    <h1 className="text-5xl md:text-8xl font-light tracking-tighter uppercase leading-none text-gray-900">
                        Track <span className="font-bold italic">Order</span>
                    </h1>
                </div>

                <div className="bg-gray-50 rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-2xl shadow-indigo-100/20 mb-16">
                    <form onSubmit={handleTrack} className="relative group">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="ENTER ORDER ID"
                                    className="w-full bg-white border-none rounded-2xl py-6 px-8 text-sm font-bold uppercase tracking-widest focus:ring-2 focus:ring-accent-gold transition-all shadow-sm placeholder:text-gray-200"
                                    required
                                />
                            </div>
                            <button
                                disabled={loading}
                                type="submit"
                                className="bg-black text-white px-12 py-6 rounded-2xl font-bold text-xs uppercase tracking-[0.3em] hover:bg-accent-gold transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Track</span>
                                        <Search className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-10 p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-top-4">
                            <AlertCircle className="w-6 h-6 text-rose-500" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600">{error}</p>
                        </div>
                    )}

                    {order && (
                        <div className="mt-16 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="flex flex-wrap items-center justify-between gap-8 pb-12 border-b border-gray-100">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Order ID</label>
                                    <p className="text-sm font-bold text-gray-900 font-mono break-all uppercase tracking-tighter">
                                        {order._id}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Order Status</label>
                                    <span className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                                        order.status === 'Shipped' ? 'bg-accent-gold/10 text-accent-gold' :
                                            order.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' :
                                                'bg-amber-50 text-amber-600'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Order Total</label>
                                    <p className="text-lg font-bold text-accent-gold tracking-tighter">${order.totalPrice.toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="py-12 border-b border-gray-100">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-8">Ordered Items</h4>
                                <div className="space-y-6">
                                    {order.items?.map((item: any, idx: number) => (
                                        <Link
                                            key={idx}
                                            to={`/products/${item.product?._id || item.product}`}
                                            className="flex items-center gap-6 group/item hover:bg-accent-gold/10/50 p-3 -m-3 rounded-2xl transition-all"
                                        >
                                            <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden border border-gray-50 flex-shrink-0 shadow-sm">
                                                <img
                                                    src={item.product?.images?.[0]?.url || item.product?.image || '/placeholder.png'}
                                                    alt={item.product?.name}
                                                    className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all duration-500"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-1 group-hover/item:text-accent-gold">{item.product?.name}</h5>
                                                <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                                    <span>Qty: {item.quantity}</span>
                                                    <span>•</span>
                                                    <span>Unit: ${item.price.toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <div className="text-[11px] font-bold text-gray-900">${(item.quantity * item.price).toFixed(2)}</div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-50 flex-shrink-0">
                                            <Truck className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Shipping Carrier</label>
                                            <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">Express Shipping</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-50 flex-shrink-0">
                                            <Package className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Tracking Number</label>
                                            <p className="text-sm font-bold text-gray-900 font-mono tracking-widest">{order.trackingNumber || 'PENDING'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">Order Security</h4>
                                        <p className="text-xs font-medium text-gray-500 leading-relaxed">
                                            Verification successful. This order is protected by our encryption and 30-day return policy.
                                        </p>
                                    </div>
                                    <Link
                                        to={order.status === 'Cancelled' ? '/products' : `/profile?tab=orders`}
                                        className="mt-8 flex items-center justify-between group/link"
                                    >
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-black group-hover/link:text-accent-gold transition-colors">
                                            View full order
                                        </span>
                                        <ChevronRight className="w-5 h-5 group-hover/link:translate-x-2 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">
                        Secure Order Tracking System
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
