import React, { useState, useEffect } from 'react';
import {
    Search,
    ShoppingBag,
    ChevronRight,
    Loader2,
    Calendar,
    X,
    User,
    MapPin,
    CreditCard,
    Package,
    Hash,
    CheckCircle,
    Clock,
    Truck,
    XCircle,
    AlertCircle,
    Mail,
    Phone,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { Order, Product, User as UserType } from '../../types';

const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    Pending: { icon: <Clock className="w-3.5 h-3.5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
    Processing: { icon: <AlertCircle className="w-3.5 h-3.5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
    Shipped: { icon: <Truck className="w-3.5 h-3.5" />, color: 'text-purple-600', bg: 'bg-purple-50' },
    Delivered: { icon: <CheckCircle className="w-3.5 h-3.5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    Cancelled: { icon: <XCircle className="w-3.5 h-3.5" />, color: 'text-red-600', bg: 'bg-red-50' },
};

interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
    const user = order.user as UserType;
    const status = statusConfig[order.status] || statusConfig.Pending;

    const getProductName = (product: string | Product): string => {
        if (typeof product === 'string') return 'Product #' + product.slice(-6);
        return (product as Product).name || 'Unknown Product';
    };

    const getProductImage = (product: string | Product): string | undefined => {
        if (typeof product === 'string') return undefined;
        const p = product as Product;
        if (p.images && p.images.length > 0) return p.images[0].url;
        return (p as any).image;
    };

    const parseAddress = (addr: any): string => {
        if (!addr) return 'N/A';
        if (typeof addr === 'string') return addr;
        const parts = [
            addr.fullName,
            addr.streetAddress,
            addr.city,
            addr.state,
            addr.postalCode,
            addr.country,
        ].filter(Boolean);
        return parts.join(', ');
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent-gold rounded-2xl flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                                Order Details
                            </h2>
                            <p className="text-xs font-mono text-accent-gold/100 font-bold">
                                #{order._id.slice(-12).toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg ${status.bg} ${status.color}`}>
                            {status.icon}
                            {order.status}
                        </span>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto flex-1 px-8 py-6 space-y-6">

                    {/* Customer & Date Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Customer */}
                        <div className="bg-slate-50 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <User className="w-4 h-4 text-accent-gold/100" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer Info</span>
                            </div>
                            <div className="space-y-3">
                                {/* Name */}
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <User className="w-3.5 h-3.5 text-accent-gold/100" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Full Name</p>
                                        <p className="font-bold text-slate-800 text-sm">{user?.name || 'Guest'}</p>
                                    </div>
                                </div>
                                {/* Email */}
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Mail className="w-3.5 h-3.5 text-accent-gold/100" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                                        <p className="text-sm text-slate-700 font-semibold break-all">{user?.email || 'N/A'}</p>
                                    </div>
                                </div>
                                {/* Phone */}
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Phone className="w-3.5 h-3.5 text-accent-gold/100" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Phone</p>
                                        <p className="text-sm text-slate-700 font-semibold">
                                            {user?.phone || <span className="text-slate-400 font-normal italic text-xs">Not provided</span>}
                                        </p>
                                    </div>
                                </div>
                                {/* Role badge */}
                                {user?.role && (
                                    <span className="inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-indigo-100 text-accent-gold rounded-md">
                                        {user.role}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Date & Tracking */}
                        <div className="bg-slate-50 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="w-4 h-4 text-accent-gold/100" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timeline</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Ordered</span>
                                    <span className="font-bold text-slate-700">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                {order.isPaid && order.paidAt && (
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">Paid At</span>
                                        <span className="font-bold text-emerald-600">
                                            {new Date(order.paidAt).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                                {order.isDelivered && order.deliveredAt && (
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">Delivered</span>
                                        <span className="font-bold text-emerald-600">
                                            {new Date(order.deliveredAt).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                                {order.trackingNumber && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <Hash className="w-3 h-3 text-slate-400" />
                                        <span className="text-xs font-mono text-accent-gold/100 font-bold">{order.trackingNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-slate-50 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-4 h-4 text-accent-gold/100" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shipping Address</span>
                        </div>
                        {typeof order.shippingAddress === 'string' ? (
                            <p className="text-sm text-slate-700 font-medium">{order.shippingAddress}</p>
                        ) : (
                            <div className="space-y-1">
                                {(order.shippingAddress as any)?.fullName && (
                                    <p className="font-bold text-slate-800 text-sm">{(order.shippingAddress as any).fullName}</p>
                                )}
                                {(order.shippingAddress as any)?.phoneNumber && (
                                    <p className="text-xs text-slate-500">{(order.shippingAddress as any).phoneNumber}</p>
                                )}
                                <p className="text-xs text-slate-500">
                                    {parseAddress(order.shippingAddress)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className="bg-slate-50 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="w-4 h-4 text-accent-gold/100" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Order Items ({order.items.length})
                            </span>
                        </div>
                        <div className="space-y-3">
                            {order.items.map((item, idx) => {
                                const imgUrl = getProductImage(item.product);
                                const productName = getProductName(item.product);
                                return (
                                    <div key={idx} className="flex items-center gap-4 bg-white rounded-xl p-3">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                            {imgUrl ? (
                                                <img src={imgUrl} alt={productName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="w-5 h-5 text-slate-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-800 text-sm truncate">{productName}</p>
                                            <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                            <p className="text-[10px] text-slate-400">${item.price.toFixed(2)} each</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Payment Method */}
                        <div className="bg-slate-50 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="w-4 h-4 text-accent-gold/100" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${order.paymentMethod === 'Stripe' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {order.paymentMethod}
                                    </span>
                                    <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${order.isPaid ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                                        {order.isPaid ? '✓ Paid' : '✗ Unpaid'}
                                    </span>
                                </div>
                                {order.paymentResult?.id && (
                                    <p className="text-[10px] font-mono text-slate-400 truncate">
                                        Ref: {order.paymentResult.id}
                                    </p>
                                )}
                                {order.paymentResult?.email_address && (
                                    <p className="text-xs text-slate-500">{order.paymentResult.email_address}</p>
                                )}
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-slate-50 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <ShoppingBag className="w-4 h-4 text-accent-gold/100" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price Breakdown</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Subtotal</span>
                                    <span className="font-bold text-slate-700">${order.itemsPrice?.toFixed(2) ?? '—'}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Shipping</span>
                                    <span className="font-bold text-slate-700">${order.shippingPrice?.toFixed(2) ?? '—'}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Tax</span>
                                    <span className="font-bold text-slate-700">${order.taxPrice?.toFixed(2) ?? '—'}</span>
                                </div>
                                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm">
                                    <span className="font-bold text-slate-900">Total</span>
                                    <span className="font-bold text-accent-gold">${order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if (!search.trim()) {
            setFilteredOrders(orders);
        } else {
            const q = search.toLowerCase();
            setFilteredOrders(orders.filter((o) => {
                const user = o.user as UserType;
                return (
                    o._id.toLowerCase().includes(q) ||
                    user?.name?.toLowerCase().includes(q) ||
                    user?.email?.toLowerCase().includes(q)
                );
            }));
        }
    }, [search, orders]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getAllOrders();
            setOrders(data);
            setFilteredOrders(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await orderService.updateOrderStatus(id, status);
            const updater = (o: Order) => o._id === id ? { ...o, status: status as any } : o;
            setOrders(prev => prev.map(updater));
            setFilteredOrders(prev => prev.map(updater));
            if (selectedOrder?._id === id) {
                setSelectedOrder(prev => prev ? { ...prev, status: status as any } : prev);
            }
        } catch (err: any) {
            alert('Action failed: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-accent-gold animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-96 flex items-center justify-center text-red-500 font-bold">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase">Order Management</h1>
                    <p className="text-slate-400 text-sm font-medium">Manage and track all customer orders.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by Order ID or Customer..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredOrders.map((o) => {
                                const user = o.user as UserType;
                                return (
                                    <tr key={o._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-4 font-mono text-[10px] text-accent-gold font-bold">
                                            #{o._id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center space-x-2 text-slate-500">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span className="text-xs font-bold">{new Date(o.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-700 text-sm">{user?.name || 'Guest'}</span>
                                                <span className="text-[10px] text-slate-400">{user?.email || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 font-bold text-slate-900 text-sm">
                                            ${o.totalPrice.toFixed(2)}
                                        </td>
                                        <td className="px-8 py-4">
                                            <select
                                                value={o.status}
                                                onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                                                className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-lg border-none focus:ring-2 focus:ring-accent-gold/100 cursor-pointer ${o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : o.status === 'Cancelled' ? 'bg-red-50 text-red-500' : o.status === 'Shipped' ? 'bg-purple-50 text-purple-600' : o.status === 'Processing' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center justify-end">
                                                <button
                                                    onClick={() => setSelectedOrder(o)}
                                                    className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:bg-accent-gold hover:text-white transition-all"
                                                    title="View Order Details"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-16 text-center text-slate-400 text-sm font-medium">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderManagement;
