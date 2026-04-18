import React, { useState, useEffect } from 'react';

import { Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../common/ProductCard';
import { Product } from '../../types';
import { productService } from '../../services/productService';

interface FlashSaleProps {
    cmsData?: {
        enabled: boolean;
        endTime?: string;
        title?: string;
        subtitle?: string;
        discount?: number;
        products?: Product[];
    };
}

const FlashSale: React.FC<FlashSaleProps> = ({ cmsData }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const fetchFlashSaleProducts = async () => {
            try {
                // If CMS has specific products, use them
                if (cmsData?.products && cmsData.products.length > 0) {
                    setProducts(cmsData.products.map(p => {
                        const individualDiscount = p.discount || 0;
                        const globalDiscount = cmsData.discount || 0;
                        // Use individual discount if set, otherwise fallback to global sale discount
                        const effectiveDiscount = individualDiscount > 0 ? individualDiscount : globalDiscount;

                        return {
                            ...p,
                            id: (p as any)._id || p.id,
                            image: (p as any).images?.[0]?.url || (p as any).image || '',
                            category: typeof p.category === 'string' ? p.category : (p as any).category?.name || 'All',
                            discount: effectiveDiscount
                        };
                    }));
                    return;
                }

                // Fallback: Fetch products with discount > 0, sorted by biggest discount
                const data = await productService.getProducts({
                    limit: 4,
                    sort: '-discount',
                    'discount[gt]': 0
                });

                if (data.products) {
                    setProducts(data.products.map(p => ({
                        ...p,
                        id: (p as any)._id || p.id,
                        image: (p as any).images?.[0]?.url || (p as any).image || '',
                        category: typeof p.category === 'string' ? p.category : (p as any).category?.name || 'All',
                    })));
                }
            } catch (err) {
                console.error('Failed to fetch flash sale products', err);
            }
        };

        fetchFlashSaleProducts();

        // Improved countdown logic using cmsData.endTime
        const calculateTimeLeft = () => {
            if (!cmsData?.endTime) return;

            const target = new Date(cmsData.endTime).getTime();
            const now = new Date().getTime();
            const difference = target - now;

            if (difference > 0) {
                setTimeLeft({
                    hours: Math.floor((difference / (1000 * 60 * 60))),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [cmsData]);

    if (!cmsData?.enabled || products.length === 0) return null;

    const formatTime = (time: number) => time.toString().padStart(2, '0');

    return (
        <section className="py-24 px-6 bg-[#0F110F] text-sand overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-sage/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-sage/5 rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-sage text-xs uppercase tracking-[0.3em] font-black">
                                {cmsData.subtitle || 'Limited Time Offer'}
                            </span>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-sage/10 rounded-full border border-sage/20">
                                <Zap className="h-3 w-3 text-sage fill-sage" />
                                <span className="text-[10px] text-sage font-black uppercase tracking-widest">Live</span>
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-sans font-medium text-white mb-6">
                            {cmsData.title || 'Flash Sale'}
                        </h2>

                        {/* Countdown Integrated */}
                        <div className="flex gap-4">
                            {[
                                { label: 'Hr', value: timeLeft.hours },
                                { label: 'Min', value: timeLeft.minutes },
                                { label: 'Sec', value: timeLeft.seconds }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-baseline gap-2">
                                    <span className="text-3xl font-sans text-white">{formatTime(item.value)}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-sand/30 font-bold">{item.label}</span>
                                    {idx < 2 && <span className="text-white/20 ml-2">:</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Link to="/products" className="hidden md:flex items-center gap-3 text-sand/60 hover:text-white transition-all duration-300 group pb-2 border-b border-white/5 hover:border-white/20">
                        <span className="text-xs uppercase tracking-widest font-black">View All Offers</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="relative group/card">
                            {product.discount > 0 && (
                                <div className="absolute top-4 left-4 z-20 bg-white text-black text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl">
                                    -{product.discount}%
                                </div>
                            )}
                            <div className="bg-[#1A1C1A] rounded-sm p-4 transition-transform duration-500 group-hover/card:-translate-y-2">
                                <ProductCard product={product} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center md:hidden">
                    <Link to="/products" className="inline-flex items-center gap-4 bg-white text-black px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:bg-sage hover:text-white transition-all shadow-xl">
                        Explore Offers
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FlashSale;
