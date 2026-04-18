import React, { useEffect, useState } from 'react';
import { testimonialService, Testimonial } from '../../services/testimonialService';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const data = await testimonialService.getTestimonials();
                setTestimonials(data);
            } catch (error) {
                console.error('Failed to load testimonials:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    useEffect(() => {
        if (!isPaused && testimonials.length > 0) {
            const timer = setInterval(() => {
                setCurrent((prev) => (prev + 1) % testimonials.length);
            }, 3000);
            return () => clearInterval(timer);
        }
    }, [isPaused, testimonials.length]);

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    if (loading) {
        return (
            <section className="py-20 bg-sand/30">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center">
                        <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (testimonials.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-sand/30 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans text-primary mb-3 sm:mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-base sm:text-lg text-primary/70 max-w-2xl mx-auto px-4">
                        Discover why thousands choose us for sustainable luxury
                    </p>
                </div>

                {/* Slider Container */}
                <div
                    className="relative max-w-4xl mx-auto"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Main Slide Area */}
                    <div className="relative overflow-hidden min-h-[350px] sm:min-h-[400px] flex items-center">
                        <div
                            className="flex transition-transform duration-700 ease-out w-full"
                            style={{ transform: `translateX(-${current * 100}%)` }}
                        >
                            {testimonials.map((testimonial) => (
                                <div
                                    key={testimonial._id}
                                    className="w-full flex-shrink-0 px-4"
                                >
                                    <div className="bg-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-lg relative mx-auto max-w-3xl">
                                        <div className="absolute top-6 sm:top-8 right-6 sm:right-8 opacity-10">
                                            <Quote className="w-12 h-12 sm:w-16 sm:h-16 text-sage" />
                                        </div>

                                        <div className="flex flex-col items-center text-center">
                                            <div className="flex gap-1 mb-4 sm:mb-6">
                                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-muted-gold" />
                                                ))}
                                            </div>

                                            <p className="text-lg sm:text-xl md:text-2xl text-primary/80 mb-6 sm:mb-8 italic leading-relaxed font-sans">
                                                "{testimonial.content}"
                                            </p>

                                            <div className="flex flex-col items-center gap-2 sm:gap-3">
                                                {testimonial.avatar ? (
                                                    <img
                                                        src={testimonial.avatar}
                                                        alt={testimonial.name}
                                                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-sage/20"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-sage/10 flex items-center justify-center text-sage font-sans text-xl sm:text-2xl font-bold">
                                                        {testimonial.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="font-sans font-bold text-base sm:text-lg text-primary">
                                                        {testimonial.name}
                                                    </h4>
                                                    <p className="text-xs sm:text-sm text-primary/60">
                                                        {testimonial.role}
                                                        {testimonial.company && `, ${testimonial.company}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 sm:left-2 md:-left-4 lg:-left-12 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 sm:p-3 rounded-full shadow-md text-primary transition-all hover:scale-110 z-10"
                        aria-label="Previous testimonial"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 sm:right-2 md:-right-4 lg:-right-12 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 sm:p-3 rounded-full shadow-md text-primary transition-all hover:scale-110 z-10"
                        aria-label="Next testimonial"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${current === index ? 'w-8 bg-sage' : 'w-2 bg-sage/30 hover:bg-sage/50'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
