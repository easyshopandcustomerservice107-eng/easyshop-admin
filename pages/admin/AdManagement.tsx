import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, Megaphone, Check, X, Image as ImageIcon, ExternalLink, Activity, Eye, Play, Monitor } from 'lucide-react';
import { adService, Ad } from '../../services/adService';

const AdManagement: React.FC = () => {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAd, setEditingAd] = useState<Ad | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [showLivePreview, setShowLivePreview] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        link: '',
        type: 'popup' as 'popup' | 'banner',
        isActive: true,
        displayFrequency: 1
    });

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            setLoading(true);
            const data = await adService.getAds();
            setAds(data);
        } catch (err) {
            console.error('Failed to load ads');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (ad?: Ad) => {
        if (ad) {
            setEditingAd(ad);
            setFormData({
                title: ad.title,
                description: ad.description || '',
                link: ad.link,
                type: ad.type,
                isActive: ad.isActive,
                displayFrequency: ad.displayFrequency
            });
            setPreview(ad.image.url);
        } else {
            setEditingAd(null);
            setFormData({
                title: '',
                description: '',
                link: '#',
                type: 'popup',
                isActive: true,
                displayFrequency: 1
            });
            setPreview(null);
        }
        setFile(null);
        setIsModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('link', formData.link);
            data.append('type', formData.type);
            data.append('isActive', String(formData.isActive));
            data.append('displayFrequency', String(formData.displayFrequency));
            if (file) {
                data.append('image', file);
            }

            if (editingAd) {
                await adService.updateAd(editingAd._id, data);
            } else {
                if (!file) {
                    alert('Visual asset required for initialization');
                    setSaving(false);
                    return;
                }
                await adService.createAd(data);
            }
            fetchAds();
            setIsModalOpen(false);
        } catch (err: any) {
            alert(err.response?.data?.message || err.message || 'Failed to preserve ad data');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this advertisement?')) return;
        try {
            await adService.deleteAd(id);
            fetchAds();
        } catch (err) {
            alert('Deletion failed');
        }
    };

    return (
        <div className="space-y-12 max-w-[1600px] mx-auto pb-24">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-accent-gold">
                        <Megaphone className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Marketing Terminal</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                        Ad <span className="text-slate-200 group-hover:text-indigo-400 transition-colors">Campaigns</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-slate-950 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-4 hover:bg-accent-gold transition-all shadow-2xl shadow-indigo-100/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Deploy Campaign</span>
                    </button>
                </div>
            </div>

            {/* Metrics Overview - Aesthetic Only for now */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Active Streams', value: ads.filter(a => a.isActive).length, icon: Activity, color: 'text-emerald-500' },
                    { label: 'Total Catalog', value: ads.length, icon: Monitor, color: 'text-accent-gold/100' },
                    { label: 'Type Split', value: `${ads.filter(a => a.type === 'popup').length}P / ${ads.filter(a => a.type === 'banner').length}B`, icon: Play, color: 'text-amber-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:border-indigo-100 transition-all shadow-sm">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                            <div className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
                        </div>
                        <div className={`p-4 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            {loading ? (
                <div className="h-96 flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 border-4 border-slate-100 border-t-accent-gold rounded-full animate-spin" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Scanning Catalogs...</span>
                </div>
            ) : ads.length === 0 ? (
                <div className="h-96 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12">
                    <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-xl">
                        <Megaphone className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">No Campaigns Detected</h3>
                    <p className="text-slate-400 max-w-sm mb-10 text-sm font-medium">Your marketing terminal is currently idle. Initiate a new campaign to boost engagement.</p>
                    <button onClick={() => handleOpenModal()} className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-accent-gold transition-all">Start Transmission</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {ads.map((ad) => (
                        <div key={ad._id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden group flex flex-col hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-700 hover:-translate-y-2">
                            <div className="aspect-[4/3] relative overflow-hidden bg-slate-50">
                                <img src={ad.image.url} alt={ad.title} className="w-full h-full object-cover grayscale-[0.3] transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute top-8 left-8 flex flex-col gap-2">
                                    <div className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest backdrop-blur-xl border flex items-center gap-2 ${ad.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${ad.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                                        {ad.isActive ? 'Stream Active' : 'Off-Grid'}
                                    </div>
                                    <div className="px-4 py-2 bg-slate-900/40 text-white backdrop-blur-xl rounded-xl text-[8px] font-black uppercase tracking-widest border border-white/10 uppercase">
                                        Type // {ad.type}
                                    </div>
                                </div>

                                <div className="absolute top-8 right-8 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <button onClick={() => handleOpenModal(ad)} className="p-3 bg-white text-slate-900 rounded-xl hover:bg-accent-gold hover:text-white transition-all shadow-xl">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(ad._id)} className="p-3 bg-white text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-xl">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-10 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">{ad.title}</h3>
                                </div>
                                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8 flex-1 line-clamp-2">{ad.description}</p>

                                <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-accent-gold/10 flex items-center justify-center">
                                            <Activity className="w-4 h-4 text-accent-gold" />
                                        </div>
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            Freq: {ad.displayFrequency}x
                                        </div>
                                    </div>
                                    <a href={ad.link} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[10px] font-black text-accent-gold uppercase tracking-widest group/link">
                                        <span>Target Site</span>
                                        <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 lg:p-12 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setIsModalOpen(false)} />

                    <div className="bg-white w-full max-w-6xl rounded-[4rem] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 duration-500 h-full max-h-[90vh]">
                        {/* Static Preview Sidebar */}
                        <div className="lg:w-[450px] bg-slate-50 p-12 flex flex-col border-r border-slate-100 overflow-y-auto scrollbar-hide">
                            <div className="flex items-center justify-between mb-12">
                                <div className="p-4 bg-white rounded-2xl shadow-sm">
                                    <Eye className="w-6 h-6 text-accent-gold" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowLivePreview(!showLivePreview)}
                                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${showLivePreview ? 'bg-accent-gold text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}
                                    >
                                        Live Render
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{editingAd ? 'Refine' : 'Initialize'} Campaign</h2>
                                <p className="text-slate-400 text-xs font-medium leading-relaxed uppercase tracking-wider">Configure visual properties and transmission parameters.</p>
                            </div>

                            <div className="flex-1 flex items-center justify-center">
                                {showLivePreview && preview ? (
                                    <div className="w-full animate-in zoom-in duration-500">
                                        {formData.type === 'popup' ? (
                                            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative group max-w-xs mx-auto">
                                                <div className="aspect-[4/5] relative">
                                                    <img src={preview} className="w-full h-full object-cover" alt="Live Preview" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end text-white">
                                                        <h4 className="text-xl font-black uppercase tracking-tighter mb-2">{formData.title || 'Untitled Campaign'}</h4>
                                                        <p className="text-[10px] text-white/70 font-medium mb-6 line-clamp-2">{formData.description || 'Campaign description stream...'}</p>
                                                        <div className="bg-white text-black py-3 rounded-xl text-[8px] font-bold text-center uppercase tracking-widest">Explore Product</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative group">
                                                <div className="p-8 space-y-4">
                                                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Signal // {formData.type}</span>
                                                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{formData.title || 'Untitled Campaign'}</h4>
                                                    <div className="bg-white text-black px-6 py-2.5 rounded-xl text-[8px] font-black inline-block uppercase tracking-widest">Connect</div>
                                                </div>
                                                <div className="h-40 relative">
                                                    <img src={preview} className="w-full h-full object-cover opacity-60" alt="Banner Preview" />
                                                </div>
                                            </div>
                                        )}
                                        <div className="mt-8 text-center text-[10px] font-black text-accent-gold uppercase tracking-[0.4em] animate-pulse italic">Rendering Transmission...</div>
                                    </div>
                                ) : (
                                    <div className="w-full aspect-square bg-white rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center group hover:border-indigo-200 transition-all cursor-pointer relative overflow-hidden">
                                        {preview ? (
                                            <img src={preview} alt="Visual Preview" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                                        ) : null}
                                        <ImageIcon className="w-16 h-16 text-slate-200 mb-6 group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Awaiting Visual Input</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Form Area */}
                        <form onSubmit={handleSubmit} className="flex-1 p-12 lg:p-20 overflow-y-auto space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Campaign Title</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-6 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-accent-gold/100/10 transition-all outline-none"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Flash Sale"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Visual creative</label>
                                    <label className="group w-full flex items-center justify-between p-6 bg-slate-50 border-none rounded-[1.5rem] cursor-pointer hover:bg-slate-100 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                <ImageIcon className="w-5 h-5 text-accent-gold" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-500">{file ? file.name : 'Choose Image...'}</span>
                                        </div>
                                        <div className="px-4 py-2 bg-accent-gold text-white rounded-lg text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Select</div>
                                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Copy text</label>
                                <textarea
                                    className="w-full p-6 bg-slate-50 border-none rounded-[2rem] text-sm font-bold resize-none outline-none focus:ring-4 focus:ring-accent-gold/100/10 transition-all"
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Connect shoppers with our latest collection..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Transmission link</label>
                                    <input
                                        type="text"
                                        className="w-full p-6 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold outline-none"
                                        value={formData.link}
                                        onChange={e => setFormData({ ...formData, link: e.target.value })}
                                        placeholder="/products/electronics"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Burst type</label>
                                    <div className="flex gap-4 p-2 bg-slate-50 rounded-[1.5rem]">
                                        {['popup', 'banner'].map(t => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, type: t as any })}
                                                className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === t ? 'bg-white text-accent-gold shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-12">
                                    <label className="flex items-center gap-4 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.isActive}
                                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${formData.isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-100 text-slate-300'}`}>
                                            <Check className="w-7 h-7" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-none mb-1">Live Status</span>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase">{formData.isActive ? 'Emitting' : 'Stalled'}</span>
                                        </div>
                                    </label>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Impression Limit</label>
                                        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
                                            <button type="button" onClick={() => setFormData(p => ({ ...p, displayFrequency: Math.max(1, p.displayFrequency - 1) }))} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-900 border border-slate-100 hover:bg-slate-50">-</button>
                                            <span className="w-10 text-center text-xs font-black">{formData.displayFrequency}</span>
                                            <button type="button" onClick={() => setFormData(p => ({ ...p, displayFrequency: p.displayFrequency + 1 }))} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-900 border border-slate-100 hover:bg-slate-50">+</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-10 py-5 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-12 py-5 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-4 hover:bg-accent-gold transition-all disabled:opacity-50 shadow-2xl shadow-indigo-100/20"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                                        <span>Authorize Transmission</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdManagement;
