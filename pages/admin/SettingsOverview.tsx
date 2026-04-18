import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Settings,
    CreditCard,
    Layout,
    ShieldCheck,
    MessageSquare,
    Globe,
    ChevronRight,
    ArrowLeft,
    Monitor,
    Zap,
    LayoutTemplate
} from 'lucide-react';
import PaymentSettings from './PaymentSettings';
import ContentManagement from './ContentManagement';

const SettingsOverview: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get('tab') as any;

    const [activeTab, setActiveTab] = useState<'general' | 'payments' | 'flash' | 'footer' | 'hero'>('general');

    useEffect(() => {
        if (tabParam && ['general', 'payments', 'flash', 'footer', 'hero'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const tabs = [
        { id: 'general', label: 'General Settings', icon: Globe, description: 'Site identity, SEO keywords, and global meta-data.' },
        { id: 'hero', label: 'Hero Content', icon: Layout, description: 'Manage home page slides, headings, and images.' },
        { id: 'payments', label: 'Payment Methods', icon: CreditCard, description: 'Payment gateways, PayPal keys, and COD management.' },
        { id: 'flash', label: 'Flash Sales', icon: Zap, description: 'Flash sale coordination and event triggers.' },
        { id: 'footer', label: 'Footer Management', icon: LayoutTemplate, description: 'Footer text, social media links, and copyright settings.' }
    ] as const;

    return (
        <div className="space-y-10 animate-in fade-in duration-700 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase leading-none">Settings <span className="text-accent-gold">Hub</span></h1>
                    <div className="flex items-center gap-2 mt-4">
                        <div className="h-1 w-12 bg-accent-gold rounded-full"></div>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Admin Configuration</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Vertical Navigation Sidebar */}
                <div className="w-full lg:w-80 flex-shrink-0">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-4 shadow-sm space-y-2 sticky top-24">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full group text-left p-6 rounded-[2rem] transition-all duration-500 flex flex-col gap-4 border-2 ${isActive
                                        ? 'bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-200'
                                        : 'bg-white border-transparent text-slate-400 hover:bg-slate-50 hover:border-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`p-3 rounded-2xl transition-colors ${isActive ? 'bg-accent-gold text-white' : 'bg-slate-50 text-slate-400 group-hover:text-slate-900'}`}>
                                            <tab.icon className="w-5 h-5" />
                                        </div>
                                        <ChevronRight className={`w-4 h-4 transition-transform duration-500 ${isActive ? 'translate-x-0' : '-translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                    </div>
                                    <div>
                                        <p className={`text-[11px] font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-900'}`}>{tab.label}</p>
                                        <p className="text-[9px] font-bold mt-1 leading-relaxed opacity-60">{tab.description}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <div className="animate-in fade-in slide-in-from-right-4 duration-700">
                        {activeTab === 'general' && (
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-10">
                                    <ContentManagement overrideTab="store" isEmbedded={true} />
                                </div>
                            </div>
                        )}
                        {activeTab === 'hero' && (
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-10">
                                    <ContentManagement overrideTab="hero" isEmbedded={true} />
                                </div>
                            </div>
                        )}
                        {activeTab === 'payments' && (
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-10">
                                    <PaymentSettings isEmbedded={true} />
                                </div>
                            </div>
                        )}
                        {activeTab === 'flash' && (
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-10">
                                    <ContentManagement overrideTab="flash" isEmbedded={true} />
                                </div>
                            </div>
                        )}
                        {activeTab === 'footer' && (
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-10">
                                    <ContentManagement overrideTab="footer" isEmbedded={true} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsOverview;
