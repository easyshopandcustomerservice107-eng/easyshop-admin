import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface Slide {
    id: number;
    title: string;
    subtitle: string;
    highlight: string;
    description: string;
    image: string;
    link: string;
    buttonText: string;
    isExternal?: boolean;
}

const defaultSlides: Slide[] = [
    {
        id: 1,
        title: "Experience Modern",
        highlight: "Luxury",
        subtitle: "Frontend Store",
        description: "Discover our range of sustainable essentials, crafted with care for you and the planet.",
        image: "https://images.unsplash.com/photo-1595521624992-48a59d495e6d?q=80&w=2487&auto=format&fit=crop",
        link: "/products",
        buttonText: "Shop Collection"
    },
    {
        id: 2,
        title: "Powerful Admin",
        highlight: "Dashboard",
        subtitle: "Management System",
        description: "Effortlessly manage products, orders, and users with our intuitive admin interface.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
        link: "/admin/login",
        buttonText: "Go to Admin"
    },
    {
        id: 3,
        title: "Robust Backend",
        highlight: "Architecture",
        subtitle: "API & Server",
        description: "Scalable and secure backend infrastructure powering the entire e-commerce ecosystem.",
        image: "https://images.unsplash.com/photo-1558494949-ef2bb6db87e9?q=80&w=2668&auto=format&fit=crop",
        link: "http://localhost:5000",
        buttonText: "View API",
        isExternal: true
    }
];

const Hero: React.FC<{ cmsData?: any }> = ({ cmsData }) => {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Determine slides to show
    const slides: Slide[] = React.useMemo(() => {
        let sList: Slide[] = [...defaultSlides];
        if (cmsData?.heroSlides && cmsData.heroSlides.length > 0) {
            sList = cmsData.heroSlides.map((s: any, i: number) => ({
                id: i,
                title: s.title || "Untitled",
                highlight: s.highlight || "",
                subtitle: s.subtitle || "",
                description: s.description || "",
                image: s.image || defaultSlides[0].image,
                link: s.link || "/",
                buttonText: s.buttonText || "Learn More"
            }));
        } else if (cmsData?.hero) {
            sList[0] = {
                ...sList[0],
                title: cmsData.hero.title || sList[0].title,
                highlight: cmsData.hero.highlight || sList[0].highlight,
                subtitle: cmsData.hero.subtitle || sList[0].subtitle,
                image: cmsData.hero.image || sList[0].image,
                link: cmsData.hero.link || sList[0].link,
                buttonText: cmsData.hero.buttonText || sList[0].buttonText
            };
        }
        return sList;
    }, [cmsData]);

    useEffect(() => {
        if (!isPaused && slides.length > 1) {
            const timer = setInterval(() => {
                setCurrent((prev) => (prev + 1) % slides.length);
            }, 3000);
            return () => clearInterval(timer);
        }
    }, [isPaused, slides.length]);

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <section
            className="relative h-[85vh] w-full overflow-hidden bg-black"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 md:bg-black/20" /> {/* Overlay */}
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-center items-center text-center px-6 max-w-5xl mx-auto pt-8">
                        <div className={`transition-all duration-700 transform ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <span className="text-white/90 text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-3 sm:mb-4 block font-medium">
                                {slide.subtitle}
                            </span>
                            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sans font-medium mb-4 sm:mb-6 leading-tight shadow-sm">
                                {slide.title} <br />
                                <span className="italic text-white/90 font-light">{slide.highlight}</span>
                            </h1>
                            <p className="text-white/80 text-xs sm:text-sm md:text-base lg:text-base max-w-2xl mx-auto mb-8 sm:mb-10 font-sans leading-relaxed px-4 sm:px-0">
                                {slide.description}
                            </p>

                            {slide.isExternal ? (
                                <a
                                    href={slide.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-white text-primary px-6 sm:px-10 py-3 sm:py-4 rounded-sm text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-sage hover:text-white transition-all duration-300 transform hover:scale-105"
                                >
                                    {slide.buttonText}
                                </a>
                            ) : (
                                <Link
                                    to={slide.link}
                                    className="inline-block bg-white text-primary px-6 sm:px-10 py-3 sm:py-4 rounded-sm text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-sage hover:text-white transition-all duration-300 transform hover:scale-105"
                                >
                                    {slide.buttonText}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white hover:bg-white/10 p-3 rounded-full transition-all duration-300"
                aria-label="Previous slide"
            >
                <ArrowLeft className="w-8 h-8 md:w-10 md:h-10" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white hover:bg-white/10 p-3 rounded-full transition-all duration-300"
                aria-label="Next slide"
            >
                <ArrowRight className="w-8 h-8 md:w-10 md:h-10" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`transition-all duration-300 rounded-full ${current === index
                            ? 'w-10 h-1 bg-white'
                            : 'w-2 h-2 bg-white/40 hover:bg-white/70 hover:w-4'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;
