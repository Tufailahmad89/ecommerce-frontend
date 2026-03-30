import React from 'react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../data/products';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: { product: Product; quantity: number }[];
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onRemove, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[101] flex flex-col shadow-2xl"
          >
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <ShoppingBag size={20} />
                <h2 className="text-lg font-serif uppercase tracking-widest">Your Bag</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="text-sm uppercase tracking-widest">Your bag is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex space-x-4">
                    <div className="w-24 h-32 bg-gray-100 flex-shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">₹{item.product.price.toLocaleString()}</span>
                        <button 
                          onClick={() => onRemove(item.product.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm uppercase tracking-widest text-gray-500">Subtotal</span>
                  <span className="text-lg font-medium">₹{total.toLocaleString()}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-black text-white py-4 rounded-full text-sm font-medium uppercase tracking-[0.2em] hover:bg-gray-900 transition-colors"
                >
                  Order via WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
