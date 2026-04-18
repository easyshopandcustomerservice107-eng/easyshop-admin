
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, Menu, ArrowRight, X, LogOut, ChevronDown, LogIn } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../auth/LoginForm';
import { RegisterForm } from '../auth/RegisterForm';

import { productService } from '../../services/productService';
import { contentService } from '../../services/contentService';
import { orderService } from '../../services/orderService';
import { Order, Product } from '../../types';
import ScrollProgressBar from './ScrollProgressBar';
import ScrollToTop from './ScrollToTop';
import Loader from './Loader';

const Header: React.FC<{ onCartOpen: () => void }> = ({ onCartOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [categories, setCategories] = useState<string[]>(['All']);
  const [headerConfig, setHeaderConfig] = useState({ topBarText: '', announcementEnabled: true });
  const [siteSettings, setSiteSettings] = useState<{ siteName: string; logoUrl: string }>({ siteName: 'Easy Shop and Customer Service', logoUrl: '' });
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [trackingResult, setTrackingResult] = useState<Order | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const announcements = headerConfig.topBarText.split('|').map(t => t.trim());

  useEffect(() => {
    if (announcements.length > 1) {
      const timer = setInterval(() => {
        setCurrentAnnouncement(prev => (prev + 1) % announcements.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [announcements.length]);

  const { totalItems } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await productService.getCategories();
        const catNames = ['All', ...cats.map((c: any) => c.name)];
        setCategories(catNames);
      } catch (err) {
        console.error('Failed to load categories');
      }
    };

    const fetchSettings = async () => {
      try {
        const content = await contentService.getContent('home_page');
        if (content) {
          if (content.siteSettings) {
            setSiteSettings({
              siteName: content.siteSettings.siteName || 'Easy Shop and Customer Service',
              logoUrl: content.siteSettings.logoUrl || ''
            });
            if (content.siteSettings.siteName) document.title = content.siteSettings.siteName;
          }
          if (content.header) {
            setHeaderConfig({
              topBarText: content.header.topBarText || '100% Organic & Fairtrade | Free Shipping',
              announcementEnabled: content.header.announcementEnabled ?? true
            });
          }
        }
      } catch (err) {
        console.error('Failed to load site settings');
      }
    };

    fetchCategories();
    fetchSettings();
  }, []);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingOrderId) return;
    try {
      setTrackingLoading(true);
      setTrackingError(null);
      setTrackingResult(null);
      const order = await orderService.trackOrder(trackingOrderId);
      setTrackingResult(order);
    } catch (err: any) {
      setTrackingError(err.message || 'Tracking failed. Invalid ID.');
    } finally {
      setTrackingLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await productService.searchProducts(searchQuery);
          setSuggestions(results);
        } catch (err) {
          console.error('Search failed', err);
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setMobileMenuOpen(false);
    if (location.state?.openLogin) {
      setShowLogin(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  const isHome = location.pathname === '/';

  // Styles for Eco-Luxury - Always visible navbar
  const headerClass = `fixed top-0 left-0 w-full z-[100] transition-all duration-500 flex flex-col bg-sand/95 backdrop-blur-md shadow-sm text-primary`;

  const linkClass = `text-sm font-medium tracking-wide transition-colors duration-300 font-sans text-primary hover:text-sage`;

  return (
    <>
      <ScrollProgressBar />
      <ScrollToTop />
      <header className={headerClass}>
        {headerConfig.announcementEnabled && (
          <div className="bg-sage text-white py-1.5 relative h-8 overflow-hidden flex items-center justify-center text-[10px] md:text-xs font-medium tracking-widest uppercase transition-all">
            {announcements.map((text, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${idx === currentAnnouncement ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
              >
                {text}
              </div>
            ))}
          </div>
        )}
        <div className={`w-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center min-h-[70px] md:min-h-[90px] ${isScrolled || !isHome ? 'py-3' : 'py-4'}`}>

          {/* Column 1: Mobile Menu & Desktop Nav */}
          <div className="flex-1 flex items-center justify-start">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-primary"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/" className={linkClass}>Home</Link>

              {/* Categories Dropdown */}
              <div className="relative group/categories h-full flex items-center">
                <button className={`flex items-center gap-1.5 ${linkClass} group-hover/categories:text-sage`}>
                  Categories <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover/categories:rotate-180" />
                </button>

                <div className="absolute top-full -left-4 pt-4 opacity-0 translate-y-2 invisible group-hover/categories:opacity-100 group-hover/categories:visible group-hover/categories:translate-y-0 transition-all duration-300 z-[200]">
                  <div className="bg-white border border-secondary/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] py-4 min-w-[240px] overflow-hidden backdrop-blur-sm">
                    <div className="px-6 pb-2 mb-2 border-b border-secondary/5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 text-left block">
                        Browse Collections
                      </span>
                    </div>
                    {categories.filter(c => c !== 'All').map((cat) => (
                      <Link
                        key={cat}
                        to={`/products?category=${cat}`}
                        className="flex items-center justify-between px-6 py-3 text-sm text-primary/80 hover:text-sage hover:bg-sage/5 transition-all text-left font-medium group/item"
                      >
                        <span>{cat}</span>
                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link to="/products" className={linkClass}>Shop</Link>
              <Link to="/about" className={linkClass}>Our Story</Link>
            </nav>
          </div>

          {/* Column 2: Logo (Centered) */}
          <div className="flex-shrink-0 flex items-center justify-center px-4">
            <Link
              to="/"
              className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-primary flex items-center justify-center transition-all duration-300 transform"
            >
              {siteSettings.logoUrl ? (
                <img src={siteSettings.logoUrl} alt={siteSettings.siteName} className="h-14 sm:h-16 md:h-24 w-auto object-contain" />
              ) : (
                <span>{siteSettings.siteName}</span>
              )}
            </Link>
          </div>

          {/* Column 3: Icons */}
          <div className="flex-1 flex items-center justify-end space-x-4 md:space-x-6">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-primary hover:text-sage transition-colors duration-300"
            >
              <Search className="h-5 w-5 md:h-6 md:w-6" />
            </button>

            <button
              onClick={() => setTrackingModalOpen(true)}
              className="hidden sm:block text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary hover:text-sage transition-colors duration-300"
            >
              Track
            </button>

            {isLoggedIn ? (
              <div className="relative group">
                <Link to="/profile" className="flex items-center gap-2 text-primary hover:text-sage transition-colors">
                  <User className="h-5 w-5 md:h-6 md:w-6" />
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="hidden sm:block text-xs md:text-sm font-bold uppercase tracking-widest text-primary hover:text-sage transition-colors"
              >
                Login
              </button>
            )}

            <button
              onClick={onCartOpen}
              className="relative group flex items-center gap-2 text-primary hover:text-sage transition-colors"
            >
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-sage text-white text-[9px] font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Modal - Google-like Professional Design */}
        {searchOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-start justify-center pt-20 px-4" onClick={() => setSearchOpen(false)}>
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300" onClick={(e) => e.stopPropagation()}>
              {/* Search Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Search Products</h2>
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* Google-like Search Bar */}
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 h-5 w-5 text-gray-400" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search for products..."
                      className="w-full pl-12 pr-4 py-4 text-base text-gray-900 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition-all placeholder:text-gray-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    )}
                  </div>
                  <button type="submit" className="sr-only">Search</button>
                </form>
              </div>


              {/* Search results/suggestions */}
              {(isSearching || suggestions.length > 0 || (searchQuery.length >= 2 && !isSearching)) && (
                <div className="max-h-[400px] overflow-y-auto border-b border-gray-100">
                  {isSearching ? (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                      <Loader size="md" color="#4A5D4E" />
                      <p className="mt-4 text-sm font-medium animate-pulse uppercase tracking-widest">Scanning inventory...</p>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="py-2">
                      <p className="px-6 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Matches</p>
                      {suggestions.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => {
                            navigate(`/products/${product.slug || product._id}`);
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group text-left"
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {product.images?.[0]?.url ? (
                              <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Search className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-sage transition-colors">{product.name}</h4>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">
                              {typeof product.category === 'string' ? product.category : product.category?.name}
                            </p>
                          </div>
                          <div className="text-sm font-black text-gray-900">${product.price}</div>
                        </button>
                      ))}
                    </div>
                  ) : searchQuery.length >= 2 ? (
                    <div className="p-12 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-4">
                        <Search className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-sm font-bold text-gray-900 uppercase tracking-widest"></p>
                      <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">No products found matching "{searchQuery}"</p>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Quick Links/Suggestions */}
              <div className="p-8">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Trending Collections</p>
                <div className="flex flex-wrap gap-2">
                  {['Bedding', 'Towels', 'Organic Cotton', 'Linen Sheets'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        navigate(`/products?q=${encodeURIComponent(term)}`);
                        setSearchOpen(false);
                      }}
                      className="px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-gray-50 hover:bg-black hover:text-white text-gray-700 rounded-full transition-all duration-300"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[150] lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-sand z-[160] lg:hidden transform transition-transform duration-500 ease-out shadow-2xl ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full p-6 sm:p-8 px-8 sm:px-10">
          <div className="flex items-center justify-between mb-10 sm:mb-16">
            <span className="text-lg sm:text-xl font-sans font-bold text-primary">{siteSettings.siteName}</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2">
              <X className="h-6 w-6 text-primary" />
            </button>
          </div>

          <nav className="flex flex-col space-y-5 sm:space-y-8">
            <Link to="/" className="text-xl sm:text-2xl font-sans text-primary hover:text-sage transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/products" className="text-xl sm:text-2xl font-sans text-primary hover:text-sage transition-colors" onClick={() => setMobileMenuOpen(false)}>Shop All</Link>
            <Link to="/about" className="text-xl sm:text-2xl font-sans text-primary hover:text-sage transition-colors" onClick={() => setMobileMenuOpen(false)}>Our Story</Link>

            {/* Categories Dropdown */}
            <div className="flex flex-col">
              <button
                onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                className="text-xl sm:text-2xl font-sans text-primary hover:text-sage transition-colors flex items-center justify-between"
              >
                <span>Categories</span>
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${mobileCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileCategoriesOpen && (
                <div className="flex flex-col space-y-3 mt-3 ml-4 pl-4 border-l-2 border-sage/20">
                  {categories.filter(c => c !== 'All').map((cat) => (
                    <Link
                      key={cat}
                      to={`/products?category=${cat}`}
                      className="text-base sm:text-lg font-sans text-primary/80 hover:text-sage transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="mt-auto pt-6 sm:pt-8 border-t border-primary/10 space-y-4 sm:space-y-6">
            {!isLoggedIn && (
              <button onClick={() => { setMobileMenuOpen(false); setShowLogin(true); }} className="text-base sm:text-lg font-sans text-primary block flex items-center gap-2">
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Login / Register</span>
              </button>
            )}
            {isLoggedIn && (
              <div className="flex flex-col gap-3 sm:gap-4">
                <Link to="/profile" className="text-base sm:text-lg font-sans text-primary flex items-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>My Account</span>
                </Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-base sm:text-lg font-sans text-red-500 text-left flex items-center gap-2">
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Auth & Tracking Modals - styling simplified/aligned */}
      {showLogin && (
        <LoginForm
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
        />
      )}

      {showRegister && (
        <RegisterForm
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        />
      )}

      {/* Tracking Modal (Simplified styling) */}
      {trackingModalOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-sand w-full max-w-md rounded-lg p-8 shadow-2xl relative">
            <button onClick={() => setTrackingModalOpen(false)} className="absolute top-4 right-4 text-primary/50 hover:text-primary">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-sans font-bold text-primary mb-6">Track Your Order</h3>
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <input
                type="text"
                value={trackingOrderId}
                onChange={e => setTrackingOrderId(e.target.value)}
                placeholder="Order ID"
                className="w-full bg-white p-3 rounded-md border border-primary/20 outline-none focus:border-sage"
              />
              <button
                type="submit"
                disabled={trackingLoading}
                className="w-full bg-primary text-sand py-3 rounded-md font-bold uppercase text-xs tracking-widest hover:bg-sage transition-colors"
              >
                {trackingLoading ? 'Checking...' : 'Track'}
              </button>
            </form>
            {trackingError && <p className="mt-4 text-red-500 text-sm text-center">{trackingError}</p>}
            {trackingResult && (
              <div className="mt-6 pt-6 border-t border-primary/10">
                <p className="font-bold text-primary mb-2">Status: <span className="text-sage">{trackingResult.status}</span></p>
                <p className="text-sm text-primary/70">Total: ${trackingResult.totalPrice.toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
