
import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      <div className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-[60] flex flex-col transform transition-transform duration-300 ease-out pt-28 md:pt-32 lg:pt-38 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
            <span className="bg-accent-gold/10 text-accent-gold text-xs font-bold px-2 py-0.5 rounded-full">{totalItems} items</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="h-10 w-10 text-gray-300" />
              </div>
              <p className="text-gray-500 mb-6">Your cart is currently empty</p>
              <Link to="/products" onClick={onClose} className="bg-accent-gold text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors uppercase text-xs tracking-widest">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => {
                if (!item.product) return null;
                const itemId = item._id || item.product._id || (item.product as any).id;
                const productName = item.product.name;
                const basePrice = item.product.price || item.price;
                const discount = item.product.discount || 0;
                const activePrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
                const productImage = item.product.images?.[0]?.url || item.product.image;

                return (
                  <div key={itemId} className="flex space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={productImage} alt={productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-bold text-gray-900 line-clamp-1 uppercase text-xs tracking-tight">{productName}</h4>
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-bold ${discount > 0 ? 'text-rose-600' : 'text-gray-900'}`}>
                            ${activePrice.toFixed(2)}
                          </p>
                          {discount > 0 && (
                            <p className="text-[10px] text-gray-400 line-through decoration-rose-400/20">
                              ${basePrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-100 rounded-lg">
                          <button
                            onClick={() => updateQuantity(itemId, item.quantity - 1)}
                            className="px-2 py-0.5 hover:bg-gray-50 text-gray-400"
                          >-</button>
                          <span className="px-2 text-xs font-bold text-gray-700">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(itemId, item.quantity + 1)}
                            className="px-2 py-0.5 hover:bg-gray-50 text-gray-400"
                          >+</button>
                        </div>
                        <button onClick={() => removeFromCart(itemId)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
            <div className="flex justify-between items-center text-gray-900">
              <span className="font-medium text-gray-500 text-sm uppercase tracking-widest">Subtotal</span>
              <span className="text-xl font-black">${subtotal.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="w-full bg-accent-gold text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 uppercase text-xs tracking-widest"
            >
              <span>Secure Checkout</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            {/* <Link to="/cart" onClick={onClose} className="block text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black">
              View full cart
            </Link> */}
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
