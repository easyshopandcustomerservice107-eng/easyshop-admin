import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { adService, Ad } from '../../services/adService';

const AdBanner: React.FC = () => {
    const [bannerAd, setBannerAd] = useState<Ad | null>(null);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const ads = await adService.getActiveAds();
                const banner = ads.find(ad => ad.type === 'banner');
                if (banner) setBannerAd(banner);
            } catch (err) {
                console.error('Failed to load banner transmission');
            }
        };
        fetchBanner();
    }, []);

    if (!bannerAd) return null;

    return (
        <section className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 my-10 sm:my-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="bg-slate-950 rounded-[2rem] sm:rounded-[3.5rem] overflow-hidden relative group">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8 sm:p-12 lg:p-24 flex flex-col justify-center relative z-10 order-2 lg:order-1">
                        <span className="inline-block px-3 py-1 bg-accent-gold text-white rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] mb-4 sm:mb-8">Signal Promotion</span>
                        <h2 className="text-3xl md:text-5xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-4 sm:mb-8 group-hover:text-indigo-400 transition-colors">
                            {bannerAd.title}
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-lg font-medium leading-relaxed mb-6 sm:mb-12 max-w-md">
                            {bannerAd.description}
                        </p>
                        <div>
                            <a
                                href={bannerAd.link}
                                className="inline-flex items-center gap-4 sm:gap-6 bg-white text-black px-8 sm:px-12 py-4 sm:py-6 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] hover:bg-slate-100 transition-all shadow-2xl shadow-white/5 group"
                            >
                                <span>Access Index</span>
                                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>

                    <div className="relative h-64 sm:h-96 lg:h-auto overflow-hidden order-1 lg:order-2">
                        <img
                            src={bannerAd.image.url}
                            alt={bannerAd.title}
                            className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[4000ms] ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdBanner;
