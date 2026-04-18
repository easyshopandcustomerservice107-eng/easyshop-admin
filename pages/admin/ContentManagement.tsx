import React, { useState, useEffect } from 'react';
import { Save, Upload, Loader2, Image as ImageIcon, Plus, Trash2, ChevronUp, ChevronDown, Layout, Info, ShieldCheck, ShoppingCart, Share2, Type, Clock, AlertTriangle, CreditCard, Facebook, Twitter, Instagram } from 'lucide-react';
import { contentService } from '../../services/contentService';
import { productService } from '../../services/productService';
import { paymentService } from '../../services/paymentService';
import { Product, GatewaySetting } from '../../types';

import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

interface HeroSlide {
    title: string;
    subtitle: string;
    highlight: string;
    description: string;
    buttonText: string;
    link: string;
    image: string;
}

interface ContentManagementProps {
    overrideTab?: 'hero' | 'impact' | 'legal' | 'store' | 'flash' | 'footer';
    isEmbedded?: boolean;
}

const ContentManagement: React.FC<ContentManagementProps> = ({ overrideTab, isEmbedded = false }) => {

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'hero' | 'impact' | 'legal' | 'store' | 'flash' | 'footer'>('hero');
    const [searchTerm, setSearchTerm] = useState('');


    // Legal Content States
    const [legalData, setLegalData] = useState({
        privacy: { body: '', effectiveDate: '' },
        terms: { body: '', lastUpdated: '' }
    });

    // Legacy Single Hero Previews
    const [preview, setPreview] = useState<string | null>(null);
    const [impactPreview, setImpactPreview] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    // File States
    const [file, setFile] = useState<File | null>(null);
    const [impactFile, setImpactFile] = useState<File | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    // Hero Slides States
    const [slidePreviews, setSlidePreviews] = useState<(string | null)[]>([]);
    const [slideFiles, setSlideFiles] = useState<(File | null)[]>([]);

    const [allProducts, setAllProducts] = useState<Product[]>([]);

    const [formData, setFormData] = useState({
        header: {
            topBarText: '',
            announcementEnabled: true
        },
        hero: {
            title: '',
            subtitle: '',
            highlight: '',
            buttonText: '',
            link: '',
            image: ''
        },
        heroSlides: [] as HeroSlide[],
        impact: {
            title: '',
            highlight: '',
            description: '',
            image: ''
        },
        siteSettings: {
            siteName: '',
            seoKeywords: '',
            logoUrl: ''
        },
        latestAdditions: {
            count: 6
        },
        flashSale: {
            enabled: true,
            endTime: '',
            title: 'Flash Artifacts',
            subtitle: 'Limited Availability',
            discount: 0,
            products: [] as string[]
        },
        footer: {
            description: '',
            socialLinks: {
                facebook: '',
                twitter: '',
                instagram: '',
                tiktok: '',
                github: ''
            },
            newsletterText: '',
            copyrightText: ''
        }
    });

    useEffect(() => {
        fetchContent();
        if (overrideTab) {
            setActiveTab(overrideTab);
        }
    }, [overrideTab]);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const [content, productsData, privacyData, termsData] = await Promise.all([
                contentService.getContent('home_page'),
                productService.getProducts({ limit: 100 }),
                contentService.getContent('privacy_policy').catch(() => null),
                contentService.getContent('terms_service').catch(() => null)
            ]);
            setAllProducts(productsData.products);

            if (privacyData) setLegalData(prev => ({ ...prev, privacy: privacyData }));
            if (termsData) setLegalData(prev => ({ ...prev, terms: termsData }));

            if (content) {
                const fetchedSlides = content.heroSlides || [];
                setFormData({
                    header: {
                        topBarText: content.header?.topBarText || '',
                        announcementEnabled: content.header?.announcementEnabled ?? true
                    },
                    hero: {
                        title: content.hero?.title || '',
                        subtitle: content.hero?.subtitle || '',
                        highlight: content.hero?.highlight || '',
                        buttonText: content.hero?.buttonText || '',
                        link: content.hero?.link || '',
                        image: content.hero?.image || ''
                    },
                    heroSlides: fetchedSlides,
                    impact: {
                        title: content.impact?.title || '',
                        highlight: content.impact?.highlight || '',
                        description: content.impact?.description || '',
                        image: content.impact?.image || ''
                    },
                    siteSettings: {
                        siteName: content.siteSettings?.siteName || '',
                        seoKeywords: content.siteSettings?.seoKeywords || '',
                        logoUrl: content.siteSettings?.logoUrl || ''
                    },
                    latestAdditions: {
                        count: content.latestAdditions?.count || 6
                    },
                    flashSale: {
                        enabled: content.flashSale?.enabled ?? true,
                        endTime: content.flashSale?.endTime ? new Date(content.flashSale.endTime).toISOString().slice(0, 16) : '',
                        title: content.flashSale?.title || 'Flash Artifacts',
                        subtitle: content.flashSale?.subtitle || 'Limited Availability',
                        products: content.flashSale?.products?.map((p: any) => typeof p === 'string' ? p : p._id) || []
                    },
                    footer: {
                        description: content.footer?.description || '',
                        socialLinks: {
                            facebook: content.footer?.socialLinks?.facebook || '',
                            twitter: content.footer?.socialLinks?.twitter || '',
                            instagram: content.footer?.socialLinks?.instagram || '',
                            tiktok: content.footer?.socialLinks?.tiktok || '',
                            github: content.footer?.socialLinks?.github || ''
                        },
                        newsletterText: content.footer?.newsletterText || '',
                        copyrightText: content.footer?.copyrightText || ''
                    }
                });
                setPreview(content.hero?.image);
                setImpactPreview(content.impact?.image);
                setLogoPreview(content.siteSettings?.logoUrl);
                setSlidePreviews(fetchedSlides.map((s: any) => s.image || null));
                setSlideFiles(new Array(fetchedSlides.length).fill(null));
            }
        } catch (err) {
            console.error('Failed to load content', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'logo' | 'impact' | 'slide', index?: number) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'hero') {
                    setFile(selectedFile);
                    setPreview(reader.result as string);
                } else if (type === 'impact') {
                    setImpactFile(selectedFile);
                    setImpactPreview(reader.result as string);
                } else if (type === 'logo') {
                    setLogoFile(selectedFile);
                    setLogoPreview(reader.result as string);
                } else if (type === 'slide' && index !== undefined) {
                    const newFiles = [...slideFiles];
                    newFiles[index] = selectedFile;
                    setSlideFiles(newFiles);

                    const newPreviews = [...slidePreviews];
                    newPreviews[index] = reader.result as string;
                    setSlidePreviews(newPreviews);
                }
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const addSlide = () => {
        setFormData(prev => ({
            ...prev,
            heroSlides: [...prev.heroSlides, {
                title: '',
                subtitle: '',
                highlight: '',
                description: '',
                buttonText: 'View More',
                link: '/products',
                image: ''
            }]
        }));
        setSlidePreviews(prev => [...prev, null]);
        setSlideFiles(prev => [...prev, null]);
    };

    const removeSlide = (index: number) => {
        setFormData(prev => ({
            ...prev,
            heroSlides: prev.heroSlides.filter((_, i) => i !== index)
        }));
        setSlidePreviews(prev => prev.filter((_, i) => i !== index));
        setSlideFiles(prev => prev.filter((_, i) => i !== index));
    };

    const moveSlide = (index: number, direction: 'up' | 'down') => {
        const newSlides = [...formData.heroSlides];
        const newPreviews = [...slidePreviews];
        const newFiles = [...slideFiles];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < newSlides.length) {
            [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
            [newPreviews[index], newPreviews[targetIndex]] = [newPreviews[targetIndex], newPreviews[index]];
            [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];

            setFormData(prev => ({ ...prev, heroSlides: newSlides }));
            setSlidePreviews(newPreviews);
            setSlideFiles(newFiles);
        }
    };

    const handleLegalSubmit = async (type: 'privacy' | 'terms') => {
        setSaving(true);
        try {
            const identifier = type === 'privacy' ? 'privacy_policy' : 'terms_service';
            const data = new FormData();
            data.append('content', JSON.stringify(type === 'privacy' ? legalData.privacy : legalData.terms));
            await contentService.updateContent(identifier, data);
            toast.success(`${type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'} updated`);
        } catch (err: any) {
            toast.error('Update failed: ' + err.message);
        } finally {
            setSaving(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = new FormData();

            data.append('header', JSON.stringify(formData.header));
            data.append('hero', JSON.stringify(formData.hero));
            data.append('heroSlides', JSON.stringify(formData.heroSlides));
            data.append('impact', JSON.stringify(formData.impact));
            data.append('siteSettings', JSON.stringify(formData.siteSettings));
            data.append('latestAdditions', JSON.stringify(formData.latestAdditions));
            data.append('flashSale', JSON.stringify(formData.flashSale));
            data.append('footer', JSON.stringify(formData.footer));

            if (file) data.append('image', file);
            if (impactFile) data.append('impactImage', impactFile);
            if (logoFile) data.append('logo', logoFile);

            // Append slide images with dynamic keys: slideImage0, slideImage1...
            slideFiles.forEach((f, i) => {
                if (f) data.append(`slideImage${i}`, f);
            });

            const updated = await contentService.updateContent('home_page', data);

            // Fetch again to ensure sync
            fetchContent();
            toast.success('Content updated successfully');
        } catch (err: any) {
            alert('Failed to update content: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const TabButton: React.FC<{ id: typeof activeTab; label: string; icon: any }> = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all min-w-[160px] ${activeTab === id
                ? 'bg-accent-gold text-white shadow-lg shadow-indigo-100'
                : 'bg-white text-slate-400 hover:text-slate-900 shadow-sm border border-slate-50'
                }`}
        >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
        </button>
    );

    if (loading) return <div className="h-[80vh] flex items-center justify-center"><Loader size="xl" color="#4F46E5" /></div>;

    return (
        <div className={`space-y-10 max-w-6xl mx-auto pb-20 ${!isEmbedded ? 'px-4 md:px-0' : ''}`}>
            {/* Header Area */}
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-6 ${isEmbedded ? 'mb-8' : ''}`}>
                {!isEmbedded ? (
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase mb-2">Content Management</h1>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Manage your website content and policies.</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-1.5 bg-accent-gold rounded-full"></div>
                        <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                            {activeTab === 'flash' ? 'Flash Sale Settings' :
                                activeTab === 'store' ? 'Store Configuration' :
                                    activeTab === 'legal' ? 'Legal Policies' : 'Section Settings'}
                        </h3>
                    </div>
                )}

                <div className="flex-shrink-0">
                    {activeTab !== 'legal' ? (
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className={`${isEmbedded ? 'px-6 py-3 text-[9px]' : 'px-10 py-5 text-[10px]'} bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest flex items-center gap-4 hover:bg-black transition-all shadow-2xl shadow-indigo-100 disabled:opacity-50`}
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>Save {isEmbedded ? 'Settings' : 'Page Changes'}</span>
                        </button>
                    ) : (
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleLegalSubmit('privacy')}
                                disabled={saving}
                                className={`${isEmbedded ? 'px-5 py-3 text-[9px]' : 'px-8 py-4 text-[10px]'} bg-accent-gold text-white rounded-xl font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50`}
                            >
                                <ShieldCheck className="w-4 h-4" /> Save Privacy
                            </button>
                            <button
                                onClick={() => handleLegalSubmit('terms')}
                                disabled={saving}
                                className={`${isEmbedded ? 'px-5 py-3 text-[9px]' : 'px-8 py-4 text-[10px]'} bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-black transition-all shadow-lg shadow-slate-100 disabled:opacity-50`}
                            >
                                <Layout className="w-4 h-4" /> Save Terms
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Tab Navigation */}
            {!isEmbedded && (
                <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    <TabButton id="hero" label="Home Slides" icon={Layout} />
                    <TabButton id="impact" label="Impact Story" icon={Info} />
                    <TabButton id="store" label="Store Settings" icon={ShoppingCart} />
                    <TabButton id="flash" label="Flash Sale" icon={Clock} />
                    <TabButton id="footer" label="Footer / Social" icon={Share2} />
                    <TabButton id="legal" label="Legal Policies" icon={ShieldCheck} />
                </div>
            )}

            {/* Dynamic Content Area */}
            <div className={`${!isEmbedded ? 'bg-white/40 backdrop-blur-xl rounded-[3rem] border border-slate-100 p-8 md:p-14 shadow-sm' : ''} min-h-[700px]`}>
                <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* 1. Hero Tab */}
                        {activeTab === 'hero' && (
                            <div className="space-y-12">
                                <div className="flex justify-between items-center bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100/50">
                                    <div>
                                        <h3 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Home Slides</h3>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-accent-gold/100 rounded-full animate-pulse"></div>
                                            Active Slides: {formData.heroSlides.length}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addSlide}
                                        className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-accent-gold shadow-xl shadow-indigo-100"
                                    >
                                        <Plus className="w-5 h-5" /> New Slide
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-10">
                                    {formData.heroSlides.map((slide, index) => (
                                        <div key={index} className="bg-white border border-slate-100 rounded-[3rem] p-10 relative group transition-all hover:shadow-2xl hover:shadow-accent-gold/10/30">
                                            {/* Slide Controls */}
                                            <div className="absolute right-10 top-10 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                                <button type="button" onClick={() => moveSlide(index, 'up')} disabled={index === 0} className="p-4 bg-slate-50 hover:bg-white rounded-2xl text-slate-400 hover:text-accent-gold disabled:opacity-20 border border-slate-100 shadow-sm transition-colors"><ChevronUp className="w-5 h-5" /></button>
                                                <button type="button" onClick={() => moveSlide(index, 'down')} disabled={index === formData.heroSlides.length - 1} className="p-4 bg-slate-50 hover:bg-white rounded-2xl text-slate-400 hover:text-accent-gold disabled:opacity-20 border border-slate-100 shadow-sm transition-colors"><ChevronDown className="w-5 h-5" /></button>
                                                <button type="button" onClick={() => removeSlide(index)} className="p-4 bg-rose-50 hover:bg-rose-100 rounded-2xl text-rose-400 hover:text-rose-600 ml-3 border border-rose-100 shadow-sm transition-colors"><Trash2 className="w-5 h-5" /></button>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
                                                <div className="lg:col-span-4 space-y-4">
                                                    <div className="flex justify-between items-center ml-1">
                                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Slide Image</label>
                                                        <span className="text-[9px] font-bold text-accent-gold/100 uppercase">4:5 Portrait</span>
                                                    </div>
                                                    <div className="aspect-[4/5] bg-slate-50 rounded-[2.5rem] overflow-hidden relative group border border-slate-100 shadow-inner">
                                                        {slidePreviews[index] ? <img src={slidePreviews[index]!} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-slate-200"><ImageIcon className="w-20 h-20" /></div>}
                                                        <label className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md cursor-pointer text-white">
                                                            <div className="bg-white/20 p-5 rounded-full mb-4 scale-75 group-hover:scale-100 transition-transform"><Upload className="w-8 h-8" /></div>
                                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Upload Image</span>
                                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'slide', index)} />
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="lg:col-span-8 space-y-8">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14 lg:mt-0">
                                                        <div className="space-y-3">
                                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Badge Title (Small)</label>
                                                            <input type="text" className="w-full p-5 bg-slate-50 border-none rounded-2xl text-[11px] font-bold uppercase tracking-widest placeholder:text-slate-300 focus:ring-2 ring-accent-gold/100/10 transition-all" placeholder="e.g. ORGANIC LINEN" value={slide.subtitle} onChange={e => { const s = [...formData.heroSlides]; s[index].subtitle = e.target.value; setFormData({ ...formData, heroSlides: s }); }} />
                                                        </div>
                                                        <div className="space-y-3">
                                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Highlight Text (Italic)</label>
                                                            <input type="text" className="w-full p-5 bg-slate-50 border-none rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:ring-2 ring-accent-gold/100/10 transition-all" placeholder="e.g. LIMITED" value={slide.highlight} onChange={e => { const s = [...formData.heroSlides]; s[index].highlight = e.target.value; setFormData({ ...formData, heroSlides: s }); }} />
                                                        </div>
                                                        <div className="md:col-span-2 space-y-3">
                                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Main Heading</label>
                                                            <input type="text" className="w-full p-6 bg-slate-50 border-none rounded-2xl text-2xl font-bold tracking-tighter" placeholder="Collection Title" value={slide.title} onChange={e => { const s = [...formData.heroSlides]; s[index].title = e.target.value; setFormData({ ...formData, heroSlides: s }); }} />
                                                        </div>
                                                        <div className="md:col-span-2 space-y-3">
                                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Description</label>
                                                            <textarea className="w-full p-6 bg-slate-50 border-none rounded-2xl text-xs font-medium leading-relaxed resize-none focus:ring-2 ring-accent-gold/100/10 transition-all" rows={4} placeholder="Detailed value proposition..." value={slide.description} onChange={e => { const s = [...formData.heroSlides]; s[index].description = e.target.value; setFormData({ ...formData, heroSlides: s }); }} />
                                                        </div>
                                                        <div className="space-y-3">
                                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Button Text</label>
                                                            <input type="text" className="w-full p-5 bg-slate-50 border-none rounded-2xl text-[10px] font-bold uppercase tracking-widest" value={slide.buttonText} onChange={e => { const s = [...formData.heroSlides]; s[index].buttonText = e.target.value; setFormData({ ...formData, heroSlides: s }); }} />
                                                        </div>
                                                        <div className="space-y-3">
                                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Button Link (URL)</label>
                                                            <input type="text" className="w-full p-5 bg-slate-50 border-none rounded-2xl text-[10px] font-bold" value={slide.link} onChange={e => { const s = [...formData.heroSlides]; s[index].link = e.target.value; setFormData({ ...formData, heroSlides: s }); }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. Impact Tab */}
                        {activeTab === 'impact' && (
                            <div className="space-y-12">
                                <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100/50">
                                    <h3 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Story Settings</h3>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Refine your brand's editorial impact story.</p>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                                    <div className="space-y-10">
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Story Title</label>
                                            <input type="text" className="w-full p-7 bg-slate-50 border-none rounded-[2.5rem] text-xl font-bold focus:ring-2 ring-accent-gold/100/10" placeholder="The Vision" value={formData.impact.title} onChange={e => setFormData({ ...formData, impact: { ...formData.impact, title: e.target.value } })} />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Story Description</label>
                                            <textarea className="w-full p-8 bg-slate-50 border-none rounded-[3rem] text-sm font-medium leading-[2] resize-none focus:ring-2 ring-accent-gold/100/10 h-[400px]" placeholder="Craft your narrative..." value={formData.impact.description} onChange={e => setFormData({ ...formData, impact: { ...formData.impact, description: e.target.value } })} />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Featured Image</label>
                                        <div className="aspect-[4/5] bg-slate-50 rounded-[4rem] overflow-hidden relative group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all hover:shadow-accent-gold/100/10 border border-slate-100">
                                            {impactPreview ? <img src={impactPreview} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-slate-200"><ImageIcon className="w-24 h-24" /></div>}
                                            <label className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-xl cursor-pointer text-white text-center p-10">
                                                <div className="bg-white/20 p-6 rounded-full mb-6 transform scale-75 group-hover:scale-100 transition-transform"><Upload className="w-10 h-10" /></div>
                                                <span className="text-xs font-bold uppercase tracking-[0.25em] leading-relaxed">Upload Featured Image</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'impact')} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. Store Tab */}
                        {activeTab === 'store' && (
                            <div className="space-y-12">
                                <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100/50">
                                    <h3 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Storefront & Hero Settings</h3>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Manage branding and your home page hero section.</p>
                                </div>

                                {/* Integrated Hero Settings */}
                                <div className="bg-accent-gold/10/20 p-10 rounded-[3rem] border border-indigo-100/20 space-y-10">
                                    <div className="flex items-center gap-4">
                                        <Layout className="w-6 h-6 text-accent-gold" />
                                        <h4 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Hero Slides Management</h4>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={addSlide}
                                            className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-accent-gold shadow-xl shadow-indigo-100"
                                        >
                                            <Plus className="w-5 h-5" /> New Slide
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-10">
                                        {formData.heroSlides.map((slide, index) => (
                                            <div key={index} className="bg-white border border-slate-100 rounded-[3rem] p-10 relative group transition-all hover:shadow-2xl hover:shadow-accent-gold/10/30">
                                                {/* Slide info summary for embedded view */}
                                                <div className="mb-6 flex items-center justify-between border-b border-slate-50 pb-4">
                                                    <span className="text-[10px] font-black text-accent-gold uppercase tracking-widest">Slide #{index + 1}: {slide.title || 'Untitled'}</span>
                                                    <div className="flex items-center gap-2">
                                                        <button type="button" onClick={() => moveSlide(index, 'up')} disabled={index === 0} className="p-2 text-slate-400 hover:text-accent-gold disabled:opacity-20 transition-colors"><ChevronUp className="w-4 h-4" /></button>
                                                        <button type="button" onClick={() => moveSlide(index, 'down')} disabled={index === formData.heroSlides.length - 1} className="p-2 text-slate-400 hover:text-accent-gold disabled:opacity-20 transition-colors"><ChevronDown className="w-4 h-4" /></button>
                                                        <button type="button" onClick={() => removeSlide(index)} className="p-2 text-rose-400 hover:text-rose-600 ml-2 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Title</label>
                                                        <input type="text" className="w-full p-4 bg-slate-50 border-none rounded-xl text-xs font-bold" value={slide.title} onChange={e => { const s = [...formData.heroSlides]; s[index].title = e.target.value; setFormData({ ...formData, heroSlides: s }); }} />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Subtitle</label>
                                                        <input type="text" className="w-full p-4 bg-slate-50 border-none rounded-xl text-xs font-bold" value={slide.subtitle} onChange={e => { const s = [...formData.heroSlides]; s[index].subtitle = e.target.value; setFormData({ ...formData, heroSlides: s }); }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-medium text-slate-400 italic text-center">Tip: For full image management and detailed descriptions, use the "Hero Content" tab directly.</p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                                    <div className="lg:col-span-4 space-y-10">
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Store Logo</label>
                                            <div className="aspect-square bg-slate-50 rounded-[3rem] border border-slate-100 overflow-hidden relative group">
                                                {logoPreview ? <img src={logoPreview} className="w-full h-full object-contain p-10" /> : <div className="absolute inset-0 flex items-center justify-center text-slate-200"><ImageIcon className="w-16 h-16" /></div>}
                                                <label className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm cursor-pointer text-white text-center">
                                                    <Upload className="w-7 h-7 mb-2" />
                                                    <span className="text-[9px] font-bold uppercase tracking-widest">Swap Logo</span>
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Latest Additions Count</label>
                                            <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-[2rem]">
                                                <input type="range" min="3" max="12" step="1" className="flex-1 accent-accent-gold" value={formData.latestAdditions.count} onChange={e => setFormData({ ...formData, latestAdditions: { count: parseInt(e.target.value) } })} />
                                                <span className="text-xl font-black text-accent-gold">{formData.latestAdditions.count}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-8 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Store Name</label>
                                                <input type="text" className="w-full p-6 bg-slate-50 border-none rounded-2xl text-xs font-bold uppercase tracking-widest" value={formData.siteSettings.siteName} onChange={e => setFormData({ ...formData, siteSettings: { ...formData.siteSettings, siteName: e.target.value } })} />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Announcement Bar</label>
                                                <div className="flex bg-slate-50 p-6 rounded-2xl items-center justify-between">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{formData.header.announcementEnabled ? 'Active' : 'Disabled'}</span>
                                                    <button onClick={() => setFormData({ ...formData, header: { ...formData.header, announcementEnabled: !formData.header.announcementEnabled } })} className={`w-14 h-8 rounded-full transition-all relative ${formData.header.announcementEnabled ? 'bg-accent-gold' : 'bg-slate-200'}`}>
                                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.header.announcementEnabled ? 'right-1' : 'left-1'}`} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Announcement Text</label>
                                                <input type="text" className="w-full p-6 bg-slate-50 border-none rounded-2xl text-xs font-bold" value={formData.header.topBarText} onChange={e => setFormData({ ...formData, header: { ...formData.header, topBarText: e.target.value } })} />
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">SEO Keywords</label>
                                                <textarea className="w-full p-6 bg-slate-50 border-none rounded-2xl text-xs font-medium leading-relaxed resize-none" rows={4} placeholder="linen, organic, bedding, sustainable..." value={formData.siteSettings.seoKeywords} onChange={e => setFormData({ ...formData, siteSettings: { ...formData.siteSettings, seoKeywords: e.target.value } })} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4. Flash Sale Tab */}
                        {activeTab === 'flash' && (
                            <div className="space-y-12">
                                <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100/50 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Flash Sale</h3>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Coordinate limited-time promotional events.</p>
                                    </div>
                                    <div className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${formData.flashSale.enabled ? 'bg-indigo-100 text-accent-gold' : 'bg-slate-100 text-slate-400'}`}>
                                        {formData.flashSale.enabled ? 'Sale Active' : 'Sale Inactive'}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                                    <div className="lg:col-span-4 space-y-8">
                                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6 shadow-2xl shadow-slate-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Status</span>
                                                <button onClick={() => setFormData({ ...formData, flashSale: { ...formData.flashSale, enabled: !formData.flashSale.enabled } })} className={`w-12 h-6 rounded-full transition-all relative ${formData.flashSale.enabled ? 'bg-accent-gold/100' : 'bg-white/10'}`}>
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.flashSale.enabled ? 'right-1' : 'left-1'}`} />
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Sale End Time</label>
                                                <input type="datetime-local" className="w-full bg-white/5 border-none rounded-2xl p-4 text-xs font-bold text-white focus:ring-1 ring-accent-gold/100" value={formData.flashSale.endTime} onChange={e => setFormData({ ...formData, flashSale: { ...formData.flashSale, endTime: e.target.value } })} />
                                            </div>
                                            <div className="pt-4 space-y-4">
                                                <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                                                    <h4 className="text-[10px] font-bold uppercase text-indigo-400 tracking-widest mb-1">Preview Title</h4>
                                                    <p className="text-lg font-bold tracking-tight">{formData.flashSale.title}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-8 space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Sale Main Title</label>
                                                <input type="text" className="w-full p-6 bg-slate-50 border-none rounded-2xl text-xs font-bold uppercase tracking-widest" value={formData.flashSale.title} onChange={e => setFormData({ ...formData, flashSale: { ...formData.flashSale, title: e.target.value } })} />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Sale Subtitle</label>
                                                <input type="text" className="w-full p-6 bg-slate-50 border-none rounded-2xl text-xs font-bold" value={formData.flashSale.subtitle} onChange={e => setFormData({ ...formData, flashSale: { ...formData.flashSale, subtitle: e.target.value } })} />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Sale Percentage (%)</label>
                                                <input type="number" className="w-full p-6 bg-slate-50 border-none rounded-2xl text-xs font-bold text-rose-600" placeholder="e.g. 20" value={formData.flashSale.discount} onChange={e => setFormData({ ...formData, flashSale: { ...formData.flashSale, discount: parseInt(e.target.value) || 0 } })} />
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ml-2">
                                                <div>
                                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Featured Products</h4>
                                                    <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Select at least 4 products to display in the sale section.</p>
                                                </div>
                                                <div className="relative w-full md:w-64">
                                                    <input
                                                        type="text"
                                                        placeholder="Search products..."
                                                        className="w-full p-4 bg-slate-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest focus:ring-1 ring-accent-gold/100"
                                                        onChange={(e) => {
                                                            const term = e.target.value.toLowerCase();
                                                            const filtered = allProducts.filter(p => p.name.toLowerCase().includes(term));
                                                            // We keep allProducts as the source of truth, but we'll use a local filter for display
                                                            (e.target as any)._filtered = filtered;
                                                            setSearchTerm(term);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-2 scrollbar-hide border border-slate-50 rounded-3xl">
                                                {allProducts.filter(p => p.name.toLowerCase().includes(searchTerm)).map(product => {
                                                    const isSelected = formData.flashSale.products.includes(product._id);
                                                    return (
                                                        <button key={product._id} onClick={() => {
                                                            const newProducts = isSelected
                                                                ? formData.flashSale.products.filter(id => id !== product._id)
                                                                : [...formData.flashSale.products, product._id];
                                                            setFormData({ ...formData, flashSale: { ...formData.flashSale, products: newProducts } });
                                                        }} className={`p-4 rounded-[2rem] text-left transition-all border-2 relative group-hover:scale-[1.02] ${isSelected ? 'bg-accent-gold border-accent-gold shadow-xl shadow-indigo-100' : 'bg-white border-slate-50 hover:border-slate-200 shadow-sm'}`}>
                                                            <div className="aspect-square bg-slate-100 rounded-2xl mb-4 overflow-hidden relative">
                                                                <img src={product.images[0]?.url} className="w-full h-full object-cover" />
                                                                {isSelected && (
                                                                    <div className="absolute inset-0 bg-accent-gold/20 backdrop-blur-[2px] flex items-center justify-center">
                                                                        <div className="bg-white p-2 rounded-full shadow-lg">
                                                                            <Save className="w-3 h-3 text-accent-gold" />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <p className={`text-[9px] font-black uppercase tracking-tight truncate mb-1 ${isSelected ? 'text-accent-gold/10' : 'text-slate-900'}`}>{product.name}</p>
                                                            <p className={`text-[8px] font-bold ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>${product.price}</p>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 5. Footer Tab */}
                        {activeTab === 'footer' && (
                            <div className="space-y-12">
                                <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100/50">
                                    <h3 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Footer Settings</h3>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Configure footer content and social media links.</p>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                                    <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-10">
                                            <div className="space-y-4">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Copyright Text</label>
                                                <input type="text" className="w-full p-6 bg-slate-50 border-none rounded-2xl text-[11px] font-bold" value={formData.footer.copyrightText} onChange={e => setFormData({ ...formData, footer: { ...formData.footer, copyrightText: e.target.value } })} />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Newsletter Text</label>
                                                <input type="text" className="w-full p-6 bg-slate-50 border-none rounded-2xl text-[11px] font-bold" value={formData.footer.newsletterText} onChange={e => setFormData({ ...formData, footer: { ...formData.footer, newsletterText: e.target.value } })} />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Footer Narrative</label>
                                                <textarea className="w-full p-6 bg-slate-50 border-none rounded-3xl text-xs font-medium resize-none leading-relaxed" rows={6} value={formData.footer.description} onChange={e => setFormData({ ...formData, footer: { ...formData.footer, description: e.target.value } })} />
                                            </div>
                                        </div>
                                        <div className="bg-accent-gold/10/30 p-10 rounded-[4rem] border border-indigo-100/50 space-y-8">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Share2 className="w-5 h-5 text-accent-gold" />
                                                <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-900">Social Links</h4>
                                            </div>
                                            {Object.entries(formData.footer.socialLinks).map(([key, value]) => {
                                                const icons: Record<string, React.ReactNode> = {
                                                    facebook: <Facebook className="w-4 h-4" />,
                                                    twitter: <Twitter className="w-4 h-4" />,
                                                    instagram: <Instagram className="w-4 h-4" />,
                                                    tiktok: (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                                                        </svg>
                                                    ),
                                                    github: <Share2 className="w-4 h-4" />
                                                };
                                                const platformLabels: Record<string, string> = {
                                                    facebook: 'Facebook',
                                                    twitter: 'Twitter / X',
                                                    instagram: 'Instagram',
                                                    tiktok: 'TikTok',
                                                    github: 'GitHub'
                                                };
                                                const placeholders: Record<string, string> = {
                                                    facebook: 'https://facebook.com/yourpage',
                                                    twitter: 'https://twitter.com/yourhandle',
                                                    instagram: 'https://instagram.com/yourhandle',
                                                    tiktok: 'https://tiktok.com/@yourhandle',
                                                    github: 'https://github.com/yourrepo'
                                                };
                                                return (
                                                    <div key={key} className="space-y-2">
                                                        <label className="text-[8px] font-bold text-indigo-400 uppercase tracking-[0.2em] ml-1">{platformLabels[key] || key}</label>
                                                        <div className="flex bg-white rounded-2xl overflow-hidden shadow-sm border border-indigo-100/50">
                                                            <div className="p-4 bg-accent-gold/10 text-accent-gold border-r border-indigo-100">{icons[key] || <Share2 className="w-4 h-4" />}</div>
                                                            <input
                                                                type="text"
                                                                placeholder={placeholders[key] || 'https://'}
                                                                className="flex-1 p-4 border-none text-[11px] font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-300"
                                                                value={value}
                                                                onChange={e => setFormData({ ...formData, footer: { ...formData.footer, socialLinks: { ...formData.footer.socialLinks, [key]: e.target.value } } })}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 6. Legal Tab */}
                        {activeTab === 'legal' && (
                            <div className="space-y-12">
                                <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100/50">
                                    <h3 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Legal Center</h3>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Manage policies and terms of service.</p>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                    {/* Privacy Policy */}
                                    <div className="bg-white border border-slate-100 rounded-[3rem] p-10 space-y-8 shadow-sm transition-all hover:shadow-accent-gold/10/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-accent-gold/10 p-4 rounded-2xl text-accent-gold"><ShieldCheck className="w-6 h-6" /></div>
                                                <h4 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Privacy Policy</h4>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Effective Date</label>
                                            <input type="text" className="w-full p-5 bg-slate-50 border-none rounded-2xl text-xs font-bold uppercase tracking-widest focus:ring-2 ring-accent-gold/100/10 transition-all" value={legalData.privacy.effectiveDate} onChange={e => setLegalData({ ...legalData, privacy: { ...legalData.privacy, effectiveDate: e.target.value } })} placeholder="e.g. Feb 8, 2026" />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Policy Content (HTML Supported)</label>
                                            <textarea className="w-full p-7 bg-slate-50 border-none rounded-3xl text-sm font-medium leading-relaxed resize-none focus:ring-2 ring-accent-gold/100/10 h-[500px]" value={legalData.privacy.body} onChange={e => setLegalData({ ...legalData, privacy: { ...legalData.privacy, body: e.target.value } })} placeholder="<h1>Heading</h1><p>Body copy...</p>" />
                                        </div>
                                    </div>

                                    {/* Terms of Service */}
                                    <div className="bg-white border border-slate-100 rounded-[3rem] p-10 space-y-8 shadow-sm transition-all hover:shadow-slate-50/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-slate-900 p-4 rounded-2xl text-white"><Layout className="w-6 h-6" /></div>
                                                <h4 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Terms of Service</h4>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Last Updated</label>
                                            <input type="text" className="w-full p-5 bg-slate-50 border-none rounded-2xl text-xs font-bold uppercase tracking-widest focus:ring-2 ring-accent-gold/100/10 transition-all" value={legalData.terms.lastUpdated} onChange={e => setLegalData({ ...legalData, terms: { ...legalData.terms, lastUpdated: e.target.value } })} placeholder="e.g. Feb 8, 2026" />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Terms Content (HTML Supported)</label>
                                            <textarea className="w-full p-7 bg-slate-50 border-none rounded-3xl text-sm font-medium leading-relaxed resize-none focus:ring-2 ring-accent-gold/100/10 h-[500px]" value={legalData.terms.body} onChange={e => setLegalData({ ...legalData, terms: { ...legalData.terms, body: e.target.value } })} placeholder="<h1>Heading</h1><p>Body copy...</p>" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default ContentManagement;

