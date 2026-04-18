import React, { useState, useEffect } from 'react';

const ScrollProgressBar: React.FC = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (height > 0) {
                setScrollProgress(winScroll / height);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className="fixed top-0 left-0 right-0 h-[3px] bg-accent-gold z-[200] origin-left transition-transform duration-100 ease-out"
            style={{ transform: `scaleX(${scrollProgress})` }}
        />
    );
};

export default ScrollProgressBar;
