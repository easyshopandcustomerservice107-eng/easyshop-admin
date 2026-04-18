import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { adService, Ad } from '../../services/adService';
import { useLocation } from 'react-router-dom';

const AdDisplayManager: React.FC = () => {
    const [activeAds, setActiveAds] = useState<Ad[]>([]);
    const [currentPopup, setCurrentPopup] = useState<Ad | null>(null);
    const location = useLocation();

    useEffect(() => {
        const fetchActiveAds = async () => {
            try {
                const ads = await adService.getActiveAds();
                setActiveAds(ads);

                // Handling Popups
                const popupAds = ads.filter(ad => ad.type === 'popup');
                if (popupAds.length > 0) {
                    // Pick one at random or the most recent
                    const ad = popupAds[0];
                    const dismissedAt = localStorage.getItem(`ad_dismissed_${ad._id}`);
                    const now = new Date().getTime();

                    // If not dismissed or dismissed more than 24h ago (simple frequency logic)
                    if (!dismissedAt || (now - parseInt(dismissedAt)) > 24 * 60 * 60 * 1000) {
                        // Delay popup slightly for better UX
                        setTimeout(() => {
                            setCurrentPopup(ad);
                        }, 2000);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch advertisements');
            }
        };

        fetchActiveAds();
    }, []);

    const handleDismiss = () => {
        if (currentPopup) {
            localStorage.setItem(`ad_dismissed_${currentPopup._id}`, new Date().getTime().toString());
            setCurrentPopup(null);
        }
    };

    if (!currentPopup) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-500">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={handleDismiss} />
            <div className="bg-white w-full max-w-[90%] sm:max-w-lg rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col group animate-in zoom-in-95 duration-500">
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 bg-white/20 backdrop-blur-xl hover:bg-white text-white hover:text-black rounded-full z-10 transition-all border border-white/10"
                >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div className="aspect-[4/5] sm:aspect-[4/5] relative overflow-hidden bg-slate-100">
                    <img src={currentPopup.image.url} alt={currentPopup.title} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white">
                        <span className="inline-block px-3 py-1 bg-accent-gold rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] mb-4 sm:mb-6">Visual Transmission</span>
                        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter mb-2 sm:mb-4 leading-none">
                            {currentPopup.title}
                        </h2>
                        <p className="text-white/70 text-xs sm:text-sm font-medium leading-relaxed mb-6 sm:mb-10 max-w-xs">
                            {currentPopup.description}
                        </p>

                        <a
                            href={currentPopup.link}
                            onClick={handleDismiss}
                            className="inline-flex items-center gap-3 sm:gap-4 bg-white text-black px-6 sm:px-10 py-3 sm:py-5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:bg-slate-100 transition-all shadow-xl"
                        >
                            <span>Explore Now</span>
                            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdDisplayManager;
