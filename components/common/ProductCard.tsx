
import React, { useState } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { wishlistService } from '../../services/wishlistService';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const { isLoggedIn, user, refreshUser } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(() => {
    if (user?.wishlist) {
      const wishIds = (user.wishlist as any[]).map(item => typeof item === 'string' ? item : item._id);
      return wishIds.includes(product._id);
    }
    return false;
  });

  const hasDiscount = product.discount && product.discount > 0;
  const salePrice = hasDiscount ? product.price * (1 - product.discount! / 100) : product.price;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col h-full relative bg-white rounded-xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] transition-all duration-500 border border-secondary/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <Link to={`/products/${product.slug || product.id}`} target="_blank" rel="noopener noreferrer" className="relative aspect-[4/5] overflow-hidden bg-secondary/5 block">
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 ${isHovered && product.secondaryImage ? 'opacity-0' : 'opacity-100'}`}
        />
        {product.secondaryImage && (
          <img
            src={product.secondaryImage}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.stock === 0 && (
            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
              <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Departed</span>
            </div>
          )}
          {hasDiscount && (
            <div className="bg-rose-600 px-3 py-1.5 rounded-lg shadow-lg">
              <span className="text-[9px] font-black text-white uppercase tracking-widest">-{product.discount}% OFF</span>
            </div>
          )}
        </div>

        {/* Wishlist Marker */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isLoggedIn) {
              toast.error('Please login to use wishlist');
              return;
            }
            try {
              await wishlistService.toggleWishlist(product._id);
              setIsWishlisted(!isWishlisted);
              await refreshUser();
              toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
            } catch (err) {
              toast.error('Failed to update wishlist');
            }
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300 transform ${isWishlisted ? 'text-red-500 scale-110' : 'text-primary/40 hover:text-red-500 hover:scale-110'}`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Button - Appears on Hover */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 ease-out ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (product.stock > 0) addToCart(product);
            }}
            disabled={product.stock === 0}
            className={`w-full py-3.5 px-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-lg rounded-lg ${product.stock > 0
              ? 'bg-primary text-white hover:bg-sage'
              : 'bg-white/90 text-gray-400 cursor-not-allowed border border-gray-100'
              }`}
          >
            {product.stock > 0 ? 'Quick Add' : 'Out of Stock'}
          </button>
        </div>
      </Link>

      {/* Product Details Block */}
      <div className="flex flex-col flex-grow text-center p-6 space-y-3">
        <div className="space-y-1">
          <Link to={`/products/${product.slug || product.id}`} target="_blank" rel="noopener noreferrer">
            <h3 className="text-sm font-sans font-semibold text-primary/90 tracking-wide group-hover:text-sage transition-colors line-clamp-2 min-h-[40px] uppercase text-[11px] tracking-[0.05em]">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center justify-center space-x-1">
            <div className="h-px w-4 bg-sage/30"></div>
            <p className="text-[10px] text-sage font-medium uppercase tracking-widest">{product.category}</p>
            <div className="h-px w-4 bg-sage/30"></div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          {hasDiscount ? (
            <div className="flex items-center gap-3">
              <span className="text-base font-sans font-medium text-rose-600">
                ${salePrice.toFixed(2)}
              </span>
              <span className="text-xs font-sans text-gray-400 line-through decoration-rose-400/30">
                ${product.price.toFixed(2)}
              </span>
            </div>
          ) : (
            <p className="text-base font-sans font-medium text-primary">
              ${product.price.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
