
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product } from '../types';
import { cartService } from '../services/cartService';
import { shippingService, ShippingSettings } from '../services/shippingService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  loading: boolean;
  error: string | null;
  syncCart: () => Promise<void>;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Load from localStorage for guest users
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings | null>(null);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // Sync cart with backend when user logs in
  const syncCart = useCallback(async () => {
    if (!isLoggedIn) return;

    try {
      setLoading(true);
      const backendCart = await cartService.getCart();
      const formattedCart: CartItem[] = backendCart.items
        .filter(item => item.product !== null)
        .map(item => ({
          _id: item._id,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
        }));
      setCart(formattedCart);
      localStorage.removeItem('cart'); // Clear guest cart
    } catch (err: any) {
      console.error('Failed to sync cart:', err);
      setError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // Sync cart when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      syncCart();
    }
  }, [isLoggedIn, syncCart]);

  // Save to localStorage for guest users
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLoggedIn]);

  // Fetch shipping settings
  useEffect(() => {
    const fetchShipping = async () => {
      try {
        const settings = await shippingService.getSettings();
        setShippingSettings(settings);
      } catch (err) {
        console.error('Failed to fetch shipping settings:', err);
      }
    };
    fetchShipping();
  }, []);

  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      if (isLoggedIn) {
        // Add to backend
        const backendCart = await cartService.addToCart(product._id, quantity);
        const formattedCart: CartItem[] = backendCart.items
          .filter(item => item.product !== null)
          .map(item => ({
            _id: item._id,
            product: item.product,
            quantity: item.quantity,
            price: item.price,
          }));
        setCart(formattedCart);
      } else {
        // Add to local storage
        setCart(prev => {
          const existing = prev.find(item =>
            (item.product._id || item.product.id) === (product._id || product.id)
          );
          if (existing) {
            return prev.map(item =>
              (item.product._id || item.product.id) === (product._id || product.id)
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          const discount = product.discount || 0;
          const activePrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;
          return [...prev, { product, quantity, price: activePrice }];
        });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to add to cart';
      setError(msg);
      alert(msg);
      throw err;
    } finally {
      setLoading(false);
      openCart();
    }
  }, [isLoggedIn, openCart]);

  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);

      if (isLoggedIn) {
        const backendCart = await cartService.removeFromCart(itemId);
        const formattedCart: CartItem[] = backendCart.items.map(item => ({
          _id: item._id,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
        }));
        setCart(formattedCart);
      } else {
        setCart(prev => prev.filter(item =>
          (item._id || (item.product._id || item.product.id)) !== itemId
        ));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isLoggedIn) {
        const backendCart = await cartService.updateCartItem(itemId, quantity);
        const formattedCart: CartItem[] = backendCart.items
          .filter(item => item.product !== null)
          .map(item => ({
            _id: item._id,
            product: item.product,
            quantity: item.quantity,
            price: item.price,
          }));
        setCart(formattedCart);
      } else {
        setCart(prev =>
          prev.map(item =>
            (item._id || (item.product._id || item.product.id)) === itemId
              ? { ...item, quantity }
              : item
          )
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update quantity');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, removeFromCart]);

  const clearCart = useCallback(async () => {
    try {
      if (isLoggedIn) {
        await cartService.clearCart();
      }
      setCart([]);
      localStorage.removeItem('cart');
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  }, [isLoggedIn]);

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => {
    if (!item.product) return acc;
    const basePrice = item.product.price || item.price || 0;
    const discount = item.product.discount || 0;
    const activePrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
    return acc + activePrice * item.quantity;
  }, 0);
  const totalItems = cart.reduce((acc, item) => acc + (item.product ? item.quantity : 0), 0);
  const tax = 0; // Tax removed as per user request
  const shippingFee = shippingSettings?.shippingFee ?? 15;
  const freeThreshold = shippingSettings?.freeShippingThreshold ?? 100;
  const shipping = subtotal > freeThreshold || subtotal === 0 ? 0 : shippingFee;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, subtotal, tax, shipping, total,
      loading, error, syncCart,
      isOpen, openCart, closeCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
