import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-stone p-6 shadow-lg z-50 animate-fade-in border-t border-secondary/20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                    <h3 className="text-primary font-sans font-semibold text-lg mb-2">
                        We value your privacy
                    </h3>
                    <p className="text-primary/80 text-sm font-sans leading-relaxed">
                        We use cookies to enhance your browsing experience, analyze our traffic, and personalize content. 
                        By clicking "Accept", you verify that you are comfortable with our tracking policy. 
                        We align with sustainable digital practices.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setIsVisible(false)} // Just dismiss for session if declined/settings not built yet
                        className="px-6 py-2.5 text-sm font-sans text-primary border border-primary/30 hover:bg-primary/5 transition-colors duration-300 rounded-sm"
                    >
                        Decline
                    </button>
                    <button 
                        onClick={handleAccept}
                        className="px-8 py-2.5 text-sm font-sans text-white bg-sage hover:bg-earth transition-all duration-300 shadow-sm hover:shadow-md rounded-sm"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
