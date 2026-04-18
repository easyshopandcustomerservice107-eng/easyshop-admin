
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

      {/* 5. Our Impact / Story - Professional Editorial Redesign */}
      <section className="py-40 px-6 bg-[#FAF9F6] overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">

          {/* Static Editorial Image Composition */}
          <div className="relative order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 1.1, x: -30 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative aspect-[4/5] z-10"
            >
              {/* Main Image - Large & Stable */}
              <div className="w-full h-full rounded-sm overflow-hidden shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.1)]">
                <img
                  src={impact.image || "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2000"}
                  alt="Sustainable Cotton"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlapping Secondary Image - High-end Editorial Style */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                viewport={{ once: true }}
                className="absolute -bottom-12 -right-12 w-3/5 aspect-square bg-[#FAF9F6] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-20 hidden md:block"
              >
                <div className="w-full h-full overflow-hidden">
                  <img
                    src="https://media.istockphoto.com/id/1137526672/photo/young-woman-with-fabric-samples-for-curtains-at-table-multiple-color-fabric-texture-samples.jpg?s=612x612&w=0&k=20&c=kfgV-pvqjYouJ0tfX_B691UKumlA1yTB4JEzXU-qQN0="
                    alt="Fabric Detail"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-[2s]"
                  />
                </div>
              </motion.div>

              {/* Decorative Accent */}
              <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-sage/20 pointer-events-none" />
            </motion.div>
          </div>

          {/* Sophisticated Content Reveal */}
          <div className="order-1 md:order-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                    delayChildren: 0.2
                  }
                }
              }}
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0 }
                }}
                className="flex items-center gap-4 text-sage mb-8"
              >
                <span className="w-12 h-[1px] bg-sage/40"></span>
                <span className="text-[11px] uppercase tracking-[0.4em] font-black">Our Impact</span>
              </motion.div>

              <motion.h2
                variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                className="text-6xl md:text-7xl font-sans font-light mb-10 leading-[1.1] text-primary"
              >
                {impact.title || "Unearth the Rare"} <br />
                <span className="italic text-primary/60 font-sans block mt-3 indent-8 md:indent-16">
                  {impact.highlight || "Gems of the North"}
                </span>
              </motion.h2>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="text-primary/60 font-sans leading-[1.8] text-lg mb-12 max-w-lg"
              >
                {impact.description || "We believe that true beauty is forged in nature. Easy Shop and Customer Service is committed to ethical excavation and transparent sourcing. We work directly with master miners to ensure every stone is a testament to geological perfection."}
              </motion.p>

              {/* Minimalist Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 border-t border-primary/5 pt-12">
                {[
                  { label: "Natural Quality", value: "100%" },
                  { label: "Conflict Free", value: "0%" },
                  { label: "Expert Cut", value: "Pure" }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="space-y-2"
                  >
                    <h4 className="font-sans text-3xl text-primary">{stat.value}</h4>
                    <p className="text-[10px] text-primary/40 uppercase tracking-[0.2em] font-bold">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-6 text-xs uppercase tracking-[0.3em] font-black text-primary hover:text-sage transition-all"
                >
                  <span className="border-b-2 border-primary/10 group-hover:border-sage pb-2 transition-all">Read Our Story</span>
                  <div className="w-10 h-10 border border-primary/10 rounded-full flex items-center justify-center group-hover:bg-sage group-hover:border-sage transition-all">
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

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