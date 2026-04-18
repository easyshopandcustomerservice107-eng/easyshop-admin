
import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { contentService } from '../../services/contentService';
import { productService } from '../../services/productService';

const Footer: React.FC = () => {
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [content, cats] = await Promise.all([
          contentService.getContent('home_page'),
          productService.getCategories()
        ]);
        setCmsContent(content);
        setCategories(cats.map((c: any) => c.name).slice(0, 4));
      } catch (err) {
        console.error('Failed to load footer data');
      }
    };
    fetchData();
  }, []);

  const footer = cmsContent?.footer;
  const siteSettings = cmsContent?.siteSettings;

  return (
    <footer className="bg-primary text-sand pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-sans font-bold tracking-tight">
              {siteSettings?.siteName || 'Easy Shop and Customer Service'}
            </Link>
            <p className="text-sand/70 text-sm font-sans leading-relaxed max-w-xs">
              {footer?.description || 'Curating sustainable luxury for the modern home. Mindfully crafted, ethically sourced.'}
            </p>
            <div className="flex space-x-5">
              {footer?.socialLinks?.facebook && (
                <a href={footer.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-sand/60 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {footer?.socialLinks?.twitter && (
                <a href={footer.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-sand/60 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {footer?.socialLinks?.instagram && (
                <a href={footer.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-sand/60 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {footer?.socialLinks?.tiktok && (
                <a href={footer.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-sand/60 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-sans font-bold uppercase tracking-wider mb-6 text-sage">Collections</h4>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">Shop All</Link></li>
              {categories.map(cat => (
                <li key={cat}>
                  <Link to={`/products?category=${cat}`} className="text-sand/70 hover:text-white text-sm font-sans transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-sans font-bold uppercase tracking-wider mb-6 text-sage">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/shipping-returns" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/track-order" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">Track Order</Link></li>
              <li><Link to="/faq" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">About Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-sand/40 font-sans">
          <p>{footer?.copyrightText || `© ${new Date().getFullYear()} Easy Shop and Customer Service. All Rights Reserved.`}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
