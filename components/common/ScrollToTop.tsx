import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.documentElement.scrollTop;
            setIsVisible(winScroll > 300);
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (height > 0) {
                setProgress(winScroll / height);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - progress * circumference;

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={`fixed bottom-8 right-8 z-[150] flex items-center justify-center w-14 h-14 bg-primary border border-accent-gold/20 rounded-full shadow-2xl focus:outline-none group transition-all duration-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'
            }`}
        >
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <circle cx="28" cy="28" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/10" />
                <circle
                    cx="28" cy="28" r={radius}
                    stroke="currentColor" strokeWidth="3" fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="text-accent-gold transition-all duration-100"
                    strokeLinecap="round"
                />
            </svg>
            <ChevronUp className="h-5 w-5 text-white group-hover:text-accent-gold transition-colors" />
        </button>
    );
};

export default ScrollToTop;
