import React, { useState, useEffect } from 'react';
import {
    Truck,
    Save,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    DollarSign,
    TrendingUp
} from 'lucide-react';
import { shippingService, ShippingSettings as IShippingSettings } from '../../services/shippingService';
import toast from 'react-hot-toast';

const ShippingSettings: React.FC = () => {
    const [settings, setSettings] = useState<IShippingSettings>({
        shippingFee: 15,
        freeShippingThreshold: 100,
        isActive: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await shippingService.getSettings();
            setSettings(data);
        } catch (err: any) {
            toast.error('Failed to load shipping settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await shippingService.updateSettings(settings);
            toast.success('Shipping settings updated successfully');
        } catch (err: any) {
            toast.error('Failed to update shipping settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase mb-2">Shipping Settings</h1>
                <p className="text-slate-500 font-medium">Manage delivery costs and free shipping thresholds</p>
            </div>

            {/* Status Card */}
            <div className="bg-accent-gold/10 border border-indigo-100 p-6 rounded-[2rem] flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-accent-gold mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-indigo-900 uppercase tracking-tight">System Active</p>
                    <p className="text-xs text-accent-gold/80 font-medium mt-1 leading-relaxed">
                        These settings are applied globally to all orders. Changes take effect immediately on the checkout page.
                    </p>
                </div>
            </div>

            {/* Main Settings Card */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent-gold text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Configuration</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Dynamic Pricing</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Shipping Fee */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                <Truck className="w-3 h-3" />
                                Standard Shipping Fee
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={settings.shippingFee}
                                    onChange={e => setSettings({ ...settings, shippingFee: Number(e.target.value) })}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-6 text-2xl font-black text-slate-900 focus:ring-2 focus:ring-accent-gold/100 transition-all"
                                    placeholder="15.00"
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-lg">PKR</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium px-1">Flat rate applied to orders below the threshold</p>
                        </div>

                        {/* Free Shipping Threshold */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                <TrendingUp className="w-3 h-3" />
                                Free Shipping Threshold
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={settings.freeShippingThreshold}
                                    onChange={e => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-6 text-2xl font-black text-slate-900 focus:ring-2 focus:ring-accent-gold/100 transition-all"
                                    placeholder="100.00"
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-lg">PKR</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium px-1">Orders exceeding this amount receive free shipping</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-slate-900 text-white py-6 rounded-3xl font-bold text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-slate-200 hover:bg-accent-gold transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Update Shipping Policy
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Footer Help */}
            <div className="flex items-center justify-center gap-8 py-8">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" />
                    Secure Updates
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" />
                    Real-time Sync
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <AlertCircle className="w-4 h-4" />
                    Global Application
                </div>
            </div>
        </div>
    );
};

export default ShippingSettings;
