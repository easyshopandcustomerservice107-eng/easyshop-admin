import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Package, MapPin, Settings, ChevronRight, LogOut, Shield, Plus, Edit2, Trash2, X, Lock, Camera, CheckCircle2, ArrowRight, Heart, RefreshCw } from 'lucide-react';
import { Order, Address, Product } from '../types';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';
import { wishlistService } from '../services/wishlistService';
import { returnService, ReturnRequest } from '../services/returnService';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserProfile: React.FC = () => {
  const { user, logout, isLoggedIn, login, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressFormData, setAddressFormData] = useState({
    fullName: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    isDefault: false
  });

  // Security State
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState(false);

  // Profile Settings State
  const [profileFormData, setProfileFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Return Modal State
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);
  const [myReturns, setMyReturns] = useState<ReturnRequest[]>([]);
  const [selectedReturnItems, setSelectedReturnItems] = useState<{ [productId: string]: { selected: boolean, quantity: number } }>({});

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
      setProfileFormData({
        name: user?.name || '',
        phone: user?.phone || '',
      });
    }
  }, [isLoggedIn, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersData, addressesData, wishlistData, returnsData] = await Promise.all([
        orderService.getMyOrders(),
        userService.getAddresses(),
        wishlistService.getWishlist(),
        returnService.getMyReturns()
      ]);
      setOrders(ordersData);
      setAddresses(addressesData);
      setWishlist(wishlistData);
      setMyReturns(returnsData);
    } catch (err: any) {
      setError(err.message || 'Failed to sync with server');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !returnReason) return;

    const items = Object.entries(selectedReturnItems)
      .filter(([_, data]: [string, any]) => data.selected)
      .map(([productId, data]: [string, any]) => ({
        product: productId,
        quantity: data.quantity
      }));

    if (items.length === 0) {
      toast.error('Please select at least one item to return');
      return;
    }

    try {
      setIsSubmittingReturn(true);
      await returnService.createReturnRequest(selectedOrderId, returnReason, items);
      toast.success('Return request submitted successfully');
      setIsReturnModalOpen(false);
      setReturnReason('');
      setSelectedReturnItems({});
      fetchData(); // Refresh data to update button state
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit return request');
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await userService.updateAddress(editingAddress._id, addressFormData);
        toast.success('Address updated!');
      } else {
        await userService.addAddress(addressFormData);
        toast.success('Address added!');
      }
      setIsAddressModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (window.confirm('Delete this address?')) {
      try {
        await userService.deleteAddress(id);
        toast.success('Address deleted');
        fetchData();
      } catch (err: any) {
        toast.error('Failed to delete address');
      }
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setSecurityLoading(true);
      setSecuritySuccess(false);
      await userService.changePassword(securityData.currentPassword, securityData.newPassword);
      setSecuritySuccess(true);
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      const fd = new FormData();
      fd.append('name', profileFormData.name);
      fd.append('phone', profileFormData.phone);
      if (profileImage) fd.append('avatar', profileImage);

      await userService.updateProfile(fd);
      await refreshUser(); // Sync the auth context with updated data
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoginLoading(true);
      setLoginError(null);
      await login(loginEmail, loginPassword);
    } catch (err: any) {
      setLoginError(err.message || 'Encryption check failed');
    } finally {
      setLoginLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-6 px-4">
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center uppercase tracking-tighter">Login</h2>
          <p className="text-gray-400 mb-8 text-center text-xs font-bold uppercase tracking-widest leading-relaxed">Sign in to your account to manage your orders and addresses.</p>
          <form className="space-y-6" onSubmit={handleLogin}>
            {loginError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-[10px] font-bold uppercase text-center border border-red-100">
                {loginError}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Identity ID</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-accent-gold/100 p-5 rounded-2xl outline-none transition-all text-sm font-bold"
                required
                disabled={loginLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Access Cipher</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-accent-gold/100 p-5 rounded-2xl outline-none transition-all text-sm font-bold"
                required
                disabled={loginLoading}
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:bg-black transition-all disabled:opacity-50"
            >
              {loginLoading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="lg:w-80">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-8">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="relative group">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-28 h-28 rounded-full border-4 border-accent-gold/10 mb-6 object-cover shadow-xl" />
                ) : (
                  <div className="w-28 h-28 rounded-full border-4 border-accent-gold/10 mb-6 shadow-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => setActiveTab('settings')}
                  className="absolute bottom-6 right-0 bg-white p-2 rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all text-accent-gold hover:scale-110"
                  title="Edit profile"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-bold text-2xl text-gray-900 tracking-tighter uppercase">{user?.name || 'Welcome!'}</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{user?.email}</p>
            </div>
            <nav className="space-y-2">
              {[
                { id: 'orders', icon: Package, label: 'Order History' },
                { id: 'wishlist', icon: Heart, label: 'Wishlist' },
                { id: 'addresses', icon: MapPin, label: 'Addresses' },
                { id: 'security', icon: Shield, label: 'Security' },
                { id: 'settings', icon: Settings, label: 'Profile Settings' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all ${activeTab === item.id ? 'bg-accent-gold text-white shadow-xl shadow-indigo-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <div className="flex items-center space-x-4">
                    <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-white' : 'text-gray-400'}`} />
                    <span className="font-bold text-[11px] uppercase tracking-widest">{item.label}</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 ${activeTab === item.id ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center space-x-4 p-5 rounded-2xl text-rose-500 hover:bg-rose-50 font-bold text-[11px] uppercase tracking-widest mt-6"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1">
          {/* Profile completion banner */}
          {(!user?.name || !user?.phone) && (
            <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👋</span>
                <div>
                  <p className="font-semibold text-purple-900 text-sm">Complete your profile</p>
                  <p className="text-purple-600 text-xs">Add your name, phone and photo to get the best experience.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('settings')}
                className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:shadow transition-all"
              >
                Complete Profile
              </button>
            </div>
          )}

          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm min-h-[650px] relative overflow-hidden">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center py-20">
                <div className="animate-spin h-10 w-10 border-4 border-accent-gold border-t-transparent rounded-full" />
              </div>
            ) : (
              <>
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-12 tracking-tighter uppercase">Order History</h2>
                    <div className="space-y-8">
                      {orders.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-[2.5rem]">
                          <Package className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Your order history is empty.</p>
                        </div>
                      ) : (
                        orders.map(order => (
                          <div key={order._id} className="p-8 border border-gray-100 rounded-[2.5rem] bg-white shadow-sm hover:shadow-xl hover:shadow-accent-gold/10/20 transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-8 border-b border-gray-50">
                              <div className="flex items-center space-x-6">
                                <div className="w-16 h-16 bg-accent-gold/10 rounded-[1.5rem] flex items-center justify-center text-accent-gold">
                                  <Package className="h-8 w-8" />
                                </div>
                                <div className="min-w-0">
                                  <h5 className="font-bold text-[11px] text-gray-400 uppercase tracking-widest mb-1">Order ID</h5>
                                  <p className="font-mono text-sm text-gray-900 break-all uppercase selection:bg-indigo-100">{order._id}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-8">
                                <div className="text-right">
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">Order Total</p>
                                  <p className="text-xl font-bold text-gray-900">${order.totalPrice.toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">Current Status</p>
                                  <div className="flex flex-col items-end gap-2">
                                    <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg inline-block ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                                      order.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                                      {order.status}
                                    </span>
                                    {order.status === 'Delivered' && (
                                      (() => {
                                        const deliveryDate = new Date(order.deliveredAt || order.updatedAt);
                                        const now = new Date();
                                        const diffInHours = Math.abs(now.getTime() - deliveryDate.getTime()) / 36e5;
                                        const hasRequestedReturn = myReturns.some(r => (r.order?._id || r.order) === order._id);
                                        const returnReq = myReturns.find(r => (r.order?._id || r.order) === order._id);

                                        if (hasRequestedReturn) {
                                          return (
                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg">
                                              Return: {returnReq?.status}
                                            </span>
                                          );
                                        }

                                        if (diffInHours <= 48) {
                                          return (
                                            <button
                                              onClick={() => {
                                                setSelectedOrderId(order._id);
                                                // Initialize selection with all items
                                                const initialSelection: any = {};
                                                order.items.forEach((item: any) => {
                                                  initialSelection[item.product?._id || item.product] = {
                                                    selected: false,
                                                    quantity: item.quantity
                                                  };
                                                });
                                                setSelectedReturnItems(initialSelection);
                                                setIsReturnModalOpen(true);
                                              }}
                                              className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-accent-gold transition-all shadow-lg"
                                            >
                                              <RefreshCw className="w-3 h-3" />
                                              Request Return
                                            </button>
                                          );
                                        }
                                        return null;
                                      })()
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h6 className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-300 ml-1">Order Items</h6>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {order.items.map((item: any, idx: number) => (
                                  <Link
                                    key={idx}
                                    to={`/products/${item.product?._id || item.product}`}
                                    className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-accent-gold/10 transition-all group/item"
                                  >
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                                      <img
                                        src={item.product?.images?.[0]?.url || item.product?.image || '/placeholder.png'}
                                        alt={item.product?.name}
                                        className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all"
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[10px] font-bold text-gray-900 uppercase truncate group-hover/item:text-accent-gold">{item.product?.name || 'Unknown Product'}</p>
                                      <p className="text-[9px] text-gray-400 font-bold uppercase">Qty: {item.quantity} • ${item.price.toFixed(2)}</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-gray-300 opacity-0 group-hover/item:opacity-100 group-hover/item:text-accent-gold transition-all" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-gray-400">
                              <span>Order Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                              <span className="flex items-center gap-2">
                                Tracking: <span className="text-gray-900">{order.trackingNumber || 'PENDING'}</span>
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div>
                    <div className="flex items-center justify-between mb-12">
                      <h2 className="text-4xl font-bold text-gray-900 tracking-tighter uppercase">Saved Addresses</h2>
                      <button
                        onClick={() => { setEditingAddress(null); setAddressFormData({ fullName: '', phoneNumber: '', streetAddress: '', city: '', state: '', postalCode: '', country: 'USA', isDefault: false }); setIsAddressModalOpen(true); }}
                        className="bg-accent-gold text-white px-6 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center space-x-3 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Address</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {addresses.map(address => (
                        <div key={address._id} className={`p-10 border-2 rounded-[2.5rem] relative transition-all hover:shadow-lg ${address.isDefault ? 'border-accent-gold bg-accent-gold/10/10' : 'border-gray-50 bg-white'}`}>
                          {address.isDefault && (
                            <div className="absolute top-8 right-8 px-3 py-1.5 bg-accent-gold text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-lg shadow-lg">Primary</div>
                          )}
                          <div className="flex items-center space-x-3 mb-6">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${address.isDefault ? 'bg-accent-gold text-white' : 'bg-gray-50 text-gray-400'}`}>
                              <MapPin className="w-5 h-5" />
                            </div>
                            <h5 className="font-bold text-gray-900 text-sm uppercase tracking-tight">Saved Address</h5>
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed font-medium">
                            <span className="text-gray-900 font-bold">{address.fullName}</span><br />
                            {address.streetAddress}<br />
                            {address.city}, {address.state} {address.postalCode}<br />
                            <span className="uppercase tracking-widest text-[10px] text-gray-400">{address.country}</span>
                          </p>
                          <div className="mt-8 flex items-center space-x-4">
                            <button
                              onClick={() => { setEditingAddress(address); setAddressFormData(address as any); setIsAddressModalOpen(true); }}
                              className="flex items-center space-x-2 text-[10px] font-bold text-accent-gold uppercase tracking-widest hover:text-indigo-800 transition-colors bg-accent-gold/10 px-4 py-2 rounded-xl"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Adjust</span>
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address._id)}
                              className="flex items-center space-x-2 text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:text-rose-700 transition-colors bg-rose-50 px-4 py-2 rounded-xl"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Purge</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )

                }

                {activeTab === 'wishlist' && (
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-12 tracking-tighter uppercase">Wishlist</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {wishlist.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-[2.5rem]">
                          <Heart className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Your wishlist is currently void.</p>
                          <Link to="/products" className="mt-6 inline-block bg-accent-gold text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all">Explore Products</Link>
                        </div>
                      ) : (
                        wishlist.map(product => (
                          <div key={product._id} className="group p-6 border border-gray-100 rounded-[2.5rem] bg-white hover:border-indigo-100 transition-all flex items-center space-x-6">
                            <Link to={`/products/${product._id}`} className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                              <img
                                src={product.images?.[0]?.url || (product as any).image}
                                alt={product.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                              />
                            </Link>
                            <div className="flex-1 min-w-0">
                              <Link to={`/products/${product._id}`}>
                                <h4 className="font-bold text-sm text-gray-900 uppercase truncate group-hover:text-accent-gold transition-colors mb-1">{product.name}</h4>
                              </Link>
                              <p className="font-bold text-accent-gold text-sm mb-4">${product.price.toFixed(2)}</p>
                              <button
                                onClick={async () => {
                                  try {
                                    await wishlistService.toggleWishlist(product._id);
                                    setWishlist(wishlist.filter(item => item._id !== product._id));
                                    await refreshUser();  // Sync user data
                                    toast.success('Removed from wishlist');
                                  } catch (err) {
                                    toast.error('Failed to update wishlist');
                                  }
                                }}
                                className="text-[9px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-700 flex items-center space-x-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove Item</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="max-w-2xl">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12 tracking-tighter uppercase">Security Settings</h2>
                    <form onSubmit={handleSecuritySubmit} className="space-y-8">
                      {securitySuccess && (
                        <div className="bg-emerald-50 text-emerald-600 p-6 rounded-[2rem] text-xs font-bold uppercase tracking-widest flex items-center space-x-4 border border-emerald-100 animate-in fade-in zoom-in duration-300">
                          <CheckCircle2 className="w-6 h-6" />
                          <span>Password successfully updated</span>
                        </div>
                      )}
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Current Password</label>
                          <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent-gold transition-colors" />
                            <input
                              required
                              type="password"
                              value={securityData.currentPassword}
                              onChange={e => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                              placeholder="Enter existing password"
                              className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-accent-gold/100 p-5 pl-14 rounded-2xl outline-none transition-all text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">New Password</label>
                            <input
                              required
                              type="password"
                              value={securityData.newPassword}
                              onChange={e => setSecurityData({ ...securityData, newPassword: e.target.value })}
                              placeholder="New password"
                              className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-accent-gold/100 p-5 rounded-2xl outline-none transition-all text-sm font-bold"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Confirm Password</label>
                            <input
                              required
                              type="password"
                              value={securityData.confirmPassword}
                              onChange={e => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                              placeholder="Repeat password"
                              className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-accent-gold/100 p-5 rounded-2xl outline-none transition-all text-sm font-bold"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={securityLoading}
                        className="w-full bg-accent-gold text-white py-6 rounded-3xl font-bold text-[11px] uppercase tracking-[0.3em] flex items-center justify-center space-x-3 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                      >
                        {securityLoading ? 'Updating...' : 'Update Password'}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="max-w-2xl">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12 tracking-tighter uppercase">Profile Settings</h2>
                    <form onSubmit={handleProfileSubmit} className="space-y-8">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Full Name</label>
                          <input
                            type="text"
                            value={profileFormData.name}
                            onChange={e => setProfileFormData({ ...profileFormData, name: e.target.value })}
                            placeholder="Full identity"
                            className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-accent-gold/100 p-5 rounded-2xl outline-none transition-all text-sm font-bold shadow-inner"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Phone Number</label>
                          <input
                            type="text"
                            value={profileFormData.phone}
                            onChange={e => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                            placeholder="e.g., +1234567890"
                            className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-accent-gold/100 p-5 rounded-2xl outline-none transition-all text-sm font-bold shadow-inner"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Profile Picture</label>
                          <input
                            type="file"
                            onChange={e => setProfileImage(e.target.files ? e.target.files[0] : null)}
                            className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-accent-gold/100 p-4 rounded-xl text-xs font-bold"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={profileLoading}
                        className="w-full bg-gray-900 text-white py-6 rounded-3xl font-bold text-[11px] uppercase tracking-[0.3em] flex items-center justify-center space-x-3 hover:bg-black transition-all shadow-2xl disabled:opacity-50"
                      >
                        {profileLoading ? 'Updating Profile...' : 'Save All Changes'}
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div >

      {/* Address Modal */}
      {
        isAddressModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tighter uppercase">
                  {editingAddress ? 'Edit Address' : 'New Address'}
                </h2>
                <button onClick={() => setIsAddressModalOpen(false)} className="p-3 hover:bg-gray-50 rounded-2xl transition-all">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleAddressSubmit} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Full Name</label>
                    <input
                      required
                      type="text"
                      value={addressFormData.fullName}
                      onChange={e => setAddressFormData({ ...addressFormData, fullName: e.target.value })}
                      placeholder="Full name"
                      className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-accent-gold/100 p-4 rounded-2xl outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Phone Number</label>
                    <input
                      required
                      type="text"
                      value={addressFormData.phoneNumber}
                      onChange={e => setAddressFormData({ ...addressFormData, phoneNumber: e.target.value })}
                      placeholder="+1234567890"
                      className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-accent-gold/100 p-4 rounded-2xl outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Street Address</label>
                  <input
                    required
                    type="text"
                    value={addressFormData.streetAddress}
                    onChange={e => setAddressFormData({ ...addressFormData, streetAddress: e.target.value })}
                    placeholder="123 Main St, Apt 4B"
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-accent-gold/100 p-4 rounded-2xl outline-none transition-all text-sm font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">City</label>
                    <input
                      required
                      type="text"
                      value={addressFormData.city}
                      onChange={e => setAddressFormData({ ...addressFormData, city: e.target.value })}
                      placeholder="New York"
                      className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-accent-gold/100 p-4 rounded-2xl outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">State</label>
                    <input
                      required
                      type="text"
                      value={addressFormData.state}
                      onChange={e => setAddressFormData({ ...addressFormData, state: e.target.value })}
                      placeholder="NY"
                      className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-accent-gold/100 p-4 rounded-2xl outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Postal Code</label>
                    <input
                      required
                      type="text"
                      value={addressFormData.postalCode}
                      onChange={e => setAddressFormData({ ...addressFormData, postalCode: e.target.value })}
                      placeholder="10001"
                      className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-accent-gold/100 p-4 rounded-2xl outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Country</label>
                    <input
                      required
                      type="text"
                      value={addressFormData.country}
                      onChange={e => setAddressFormData({ ...addressFormData, country: e.target.value })}
                      placeholder="USA"
                      className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-accent-gold/100 p-4 rounded-2xl outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={addressFormData.isDefault}
                    onChange={e => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                    className="w-4 h-4 accent-accent-gold rounded"
                  />
                  <span className="text-sm font-bold text-gray-600">Set as default address</span>
                </label>
                <button
                  type="submit"
                  className="w-full bg-accent-gold text-white py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 mt-4"
                >
                  {editingAddress ? 'Save Changes' : 'Add Address'}
                </button>
              </form>
            </div>
          </div>
        )
      }

      {/* Return Request Modal */}
      {
        isReturnModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tighter uppercase">Request Return</h2>
                <button onClick={() => setIsReturnModalOpen(false)} className="p-3 hover:bg-gray-50 rounded-2xl transition-all">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleReturnSubmit} className="p-10 space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Select Items to Return</label>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {orders.find(o => o._id === selectedOrderId)?.items.map((item: any, idx: number) => {
                      const productId = item.product?._id || item.product;
                      const selection = selectedReturnItems[productId] || { selected: false, quantity: item.quantity };

                      return (
                        <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${selection.selected ? 'border-accent-gold bg-accent-gold/10/30' : 'border-gray-50 bg-gray-50/20'}`}>
                          <input
                            type="checkbox"
                            checked={selection.selected}
                            onChange={() => setSelectedReturnItems(prev => ({
                              ...prev,
                              [productId]: { ...prev[productId], selected: !prev[productId].selected }
                            }))}
                            className="w-5 h-5 rounded-lg border-gray-300 text-accent-gold focus:ring-accent-gold/100"
                          />
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                            <img
                              src={item.product?.images?.[0]?.url || item.product?.image || '/placeholder.png'}
                              alt={item.product?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-gray-900 uppercase truncate">{item.product?.name || 'Product'}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">${item.price.toFixed(2)}</p>
                          </div>
                          {selection.selected && (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="1"
                                max={item.quantity}
                                value={selection.quantity}
                                onChange={(e) => setSelectedReturnItems(prev => ({
                                  ...prev,
                                  [productId]: { ...prev[productId], quantity: parseInt(e.target.value) }
                                }))}
                                className="w-16 p-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-center"
                              />
                              <span className="text-[9px] font-bold text-slate-400 uppercase">/ {item.quantity}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Reason for Return</label>
                  <textarea
                    required
                    value={returnReason}
                    onChange={e => setReturnReason(e.target.value)}
                    placeholder="Tell us why you want to return these items..."
                    rows={3}
                    className="w-full p-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-accent-gold/100 transition-all shadow-inner resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingReturn}
                  className="w-full bg-accent-gold text-white py-6 rounded-3xl font-bold text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all disabled:opacity-50"
                >
                  {isSubmittingReturn ? 'Submitting Request...' : 'Submit Request'}
                </button>
              </form>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default UserProfile;
