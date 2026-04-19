
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Leaf, Award, Recycle } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { Product } from '../types';
import { productService } from '../services/productService';
import { contentService } from '../services/contentService';
import Testimonials from '../components/sections/Testimonials';
import Hero from '../components/sections/Hero';
import FlashSale from '../components/sections/FlashSale';
import { motion } from 'framer-motion';
import Loader from '../components/common/Loader';
import SEO from '../components/common/SEO';

const normalizeProduct = (product: any): Product => ({
  ...product,
  id: product._id || product.id,
  image: product.images?.[0]?.url || product.image || '',
  secondaryImage: product.images?.[1]?.url || product.secondaryImage || '',
  reviewsCount: product.numOfReviews || product.reviewsCount || 0,
  category: typeof product.category === 'string' ? product.category : product.category?.name || 'All',
});

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Step 1: Fetch CMS content first to get the dynamic limit
        const contentData = await contentService.getContent('home_page');
        const limit = contentData?.latestAdditions?.count || 8;

        // Step 2: Fetch products and categories
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts({ limit }),
          productService.getCategories()
        ]);

        // Handle Products
        let prods = [];
        if (productsData.products) prods = productsData.products;
        else if (Array.isArray(productsData)) prods = productsData;

        // Handle Categories
        let cats = [];
        if (Array.isArray(categoriesData)) {
          cats = categoriesData;
        } else if ((categoriesData as any)?.categories && Array.isArray((categoriesData as any).categories)) {
          cats = (categoriesData as any).categories;
        }

        setProducts(prods.map(normalizeProduct));
        setCategories(cats);
        setCmsContent(contentData);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader fullPage color="#4A5D4E" />;

  const hero = cmsContent?.hero || {};
  const impact = cmsContent?.impact || {};
  const usps = cmsContent?.usps || [
    { icon: 'gem', text: 'Certified Natural & Ethical' },
    { icon: 'mountain', text: 'Direct from Our Suppliers' },
    { icon: 'star', text: 'Masterfully Cut & Polished' }
  ];

  return (
    <div className="bg-sand text-primary">
      <SEO
        title="Home"
        description="Welcome to Easy Shop and Customer Service. Discover the world's most exquisite gemstones and rare minerals, ethically sourced from the heart of the North."
        keywords="gemstones, mining, emeralds, sapphires, rubies, rare minerals, ethical sourcing"
      />
      {/* 1. USP Bar (Top of Home) */}
      <div className="bg-sage/10 py-3 border-b border-sage/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 text-xs md:text-sm font-sans tracking-wide text-primary/80">
          {usps.map((usp: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2">
              {idx === 0 && <Leaf className="h-4 w-4" />}
              {idx === 1 && <Recycle className="h-4 w-4" />}
              {idx === 2 && <Star className="h-4 w-4" />}
              <span>{usp.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Hero Section */}
      <Hero cmsData={cmsContent} />

      {/* 2.5 Flash Sale Section */}

      {/* 3. Shop by Category */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="py-20 px-6 max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-sans font-medium mb-4">Gemstone Gallery</h2>
          <p className="text-primary/60 max-w-lg mx-auto font-sans">
            Discover our curated vault of rare minerals and exquisite gemstones, unearthed from the heart of the North.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((cat, idx) => (
            <Link key={cat._id || idx} to={`/products?category=${cat.name || cat}`} className="group block text-center">
              <div className="aspect-[4/5] bg-stone/20 overflow-hidden mb-4 relative rounded-md shadow-sm group-hover:shadow-lg transition-all duration-300">
                <img
                  src={cat.image?.url || cat.image || `https://images.unsplash.com/photo-1522771753035-0a15395037be?q=80&w=1000&auto=format&fit=crop`}
                  onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1522771753035-0a15395037be?q=80&w=1000')}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-sans font-medium group-hover:text-sage transition-colors">{cat.name || cat}</h3>
            </Link>
          ))}
          {categories.length === 0 && (
            ['Bedding', 'Bath', 'Robes', 'Accessories'].map((cat, idx) => (
              <Link key={idx} to="/products" className="group block text-center">
                <div className="aspect-[4/5] bg-stone/20 overflow-hidden mb-4 rounded-sm">
                  <div className="w-full h-full bg-gray-200" />
                </div>
                <h3 className="text-lg font-sans font-medium group-hover:text-sage transition-colors">{cat}</h3>
              </Link>
            ))
          )}
        </div>
      </motion.section>

      {/* 4. Bestsellers / Favorites */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        viewport={{ once: true }}
        className="bg-white py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-sage text-xs uppercase tracking-widest font-bold block mb-2">Most Loved</span>
              <h2 className="text-3xl md:text-4xl font-sans font-medium">Bestsellers</h2>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-2 text-primary/60 hover:text-primary transition-colors text-sm border-b border-transparent hover:border-primary pb-0.5">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link to="/products" className="btn-primary inline-flex">View All</Link>
          </div>
        </div>
      </motion.section>


      <FlashSale cmsData={cmsContent?.flashSale} />



      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Testimonials />
      </motion.div>

      {/* 6. Newsletter / CTA (Handled by Footer but added extra callout) */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-24 px-6 text-center bg-sand"
      >
        {/* <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-sans font-medium mb-4">Join the Collective</h2>
          <p className="text-primary/60 mb-8">Sign up for early access to new collections and sustainable living tips.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Your email address" className="flex-1 bg-white border border-transparent px-4 py-3 text-sm focus:border-sage outline-none" />
            <button className="bg-primary text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-sage transition-colors">Sign Up</button>
          </div>
        </div> */}
      </motion.section>
    </div>
  );
};

export default Home;